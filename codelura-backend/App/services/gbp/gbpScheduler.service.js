/**
 * GBP Scheduler Service
 * Handles recurring schedules, campaigns, and automated post generation
 */

import GbpPost from "../../models/gbp/GbpPost.js";
import GbpRecurringSchedule from "../../models/gbp/GbpRecurringSchedule.js";
import GbpCampaign from "../../models/gbp/GbpCampaign.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpLocationSettings from "../../models/gbp/GbpLocationSettings.js";
import { toUTC, fromUTC, addDays, formatDateTime } from "../../utils/timezone.util.js";

/**
 * Process recurring schedules and generate posts
 * Called periodically by cron (e.g., daily at midnight)
 */
export const processRecurringSchedules = async () => {
  const now = new Date();
  const tomorrow = addDays(now, 1);
  
  // Find active recurring schedules that need processing
  const schedules = await GbpRecurringSchedule.find({
    status: "active",
    $or: [
      { nextScheduledAt: { $lte: tomorrow } },
      { nextScheduledAt: null }
    ]
  });
  
  let generated = 0;
  
  for (const schedule of schedules) {
    try {
      // Check if schedule should end
      if (shouldEndSchedule(schedule)) {
        schedule.status = "completed";
        await schedule.save();
        console.log(`[GBP Scheduler] Recurring schedule ${schedule._id} completed`);
        continue;
      }
      
      // Generate next occurrence
      const nextDate = calculateNextOccurrence(schedule);
      
      if (nextDate && nextDate <= tomorrow) {
        await createScheduledPost(schedule, nextDate);
        
        schedule.lastGeneratedAt = now;
        schedule.nextScheduledAt = calculateNextOccurrence(schedule, nextDate);
        schedule.occurrenceCount += 1;
        await schedule.save();
        
        generated++;
        console.log(`[GBP Scheduler] Generated post from recurring schedule ${schedule._id}`);
      }
      
    } catch (err) {
      console.error(`[GBP Scheduler] Error processing recurring schedule ${schedule._id}:`, err.message);
    }
  }
  
  return generated;
};

/**
 * Calculate next occurrence based on recurrence pattern
 */
const calculateNextOccurrence = (schedule, fromDate = null) => {
  const baseDate = fromDate || schedule.lastGeneratedAt || schedule.startDate;
  const [hours, minutes] = schedule.timeOfDay.split(':');
  
  let nextDate;
  
  switch (schedule.recurrenceType) {
    case "daily":
      nextDate = addDays(baseDate, 1);
      break;
      
    case "weekly":
      nextDate = findNextWeeklyOccurrence(baseDate, schedule.daysOfWeek);
      break;
      
    case "biweekly":
      nextDate = findNextWeeklyOccurrence(baseDate, schedule.daysOfWeek, 14);
      break;
      
    case "monthly":
      nextDate = findNextMonthlyOccurrence(baseDate, schedule.dayOfMonth);
      break;
      
    default:
      return null;
  }
  
  // Combine date with time
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');
  
  return toUTC(`${year}-${month}-${day}`, schedule.timeOfDay, schedule.timezone);
};

/**
 * Find next occurrence for weekly/biweekly patterns
 */
const findNextWeeklyOccurrence = (fromDate, daysOfWeek, increment = 7) => {
  if (!daysOfWeek || daysOfWeek.length === 0) {
    return addDays(fromDate, increment);
  }
  
  let nextDate = addDays(fromDate, 1);
  const maxAttempts = 14; // Prevent infinite loop
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const dayOfWeek = nextDate.getDay();
    if (daysOfWeek.includes(dayOfWeek)) {
      return nextDate;
    }
    nextDate = addDays(nextDate, 1);
    attempts++;
  }
  
  return addDays(fromDate, increment);
};

/**
 * Find next occurrence for monthly patterns
 */
const findNextMonthlyOccurrence = (fromDate, dayOfMonth) => {
  const nextDate = new Date(fromDate);
  nextDate.setMonth(nextDate.getMonth() + 1);
  
  // Handle edge cases like 31st of month
  const maxDay = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  nextDate.setDate(Math.min(dayOfMonth, maxDay));
  
  return nextDate;
};

/**
 * Check if recurring schedule should end
 */
const shouldEndSchedule = (schedule) => {
  const now = new Date();
  
  // Check end date
  if (schedule.endDate && now > schedule.endDate) {
    return true;
  }
  
  // Check max occurrences
  if (schedule.maxOccurrences && schedule.occurrenceCount >= schedule.maxOccurrences) {
    return true;
  }
  
  return false;
};

/**
 * Create scheduled post from recurring template
 */
const createScheduledPost = async (schedule, scheduledAt) => {
  // Build post content with variation to prevent duplicates
  const summary = generateVariedContent(
    schedule.summaryTemplate,
    schedule.occurrenceCount
  );
  
  const postData = {
    userId: schedule.userId,
    locationId: schedule.locationId,
    recurringScheduleId: schedule._id,
    campaignId: schedule.campaignId,
    status: "scheduled",
    scheduledAt,
    scheduledTimezone: schedule.timezone,
    topicType: schedule.postType,
    summary,
    callToAction: schedule.callToAction,
    media: schedule.media,
    event: schedule.eventTemplate,
    offer: schedule.offerTemplate,
    aiGenerated: schedule.aiGenerated,
  };
  
  // Get location for Google IDs
  const location = await GbpLocation.findById(schedule.locationId);
  if (location) {
    postData.googleLocationId = location.googleLocationId;
    postData.googleAccountId = location.googleAccountId;
  }
  
  const post = await GbpPost.create(postData);
  
  // Update campaign stats
  if (schedule.campaignId) {
    await GbpCampaign.findByIdAndUpdate(schedule.campaignId, {
      $inc: { totalScheduled: 1 }
    });
  }
  
  return post;
};

/**
 * Generate varied content to prevent duplicate posts
 */
const generateVariedContent = (template, occurrenceCount) => {
  if (!template) return "";
  
  // Add subtle variations
  const variations = [
    "",
    " 🎯",
    " ✨",
    " 🌟",
    " 📢",
    " 🚀",
  ];
  
  const variation = variations[occurrenceCount % variations.length];
  
  // Also vary opening/closing if template is long
  if (template.length > 100) {
    const openings = [
      "",
      "📍 ",
      "🎓 ",
      "✅ ",
    ];
    const opening = openings[occurrenceCount % openings.length];
    return opening + template + variation;
  }
  
  return template + variation;
};

/**
 * Create recurring schedule
 */
export const createRecurringSchedule = async (userId, scheduleData) => {
  // Convert start date/time to UTC
  const startDate = toUTC(
    scheduleData.startDate,
    scheduleData.timeOfDay,
    scheduleData.timezone || "Asia/Kolkata"
  );
  
  const endDate = scheduleData.endDate 
    ? toUTC(scheduleData.endDate, "23:59", scheduleData.timezone || "Asia/Kolkata")
    : null;
  
  const schedule = await GbpRecurringSchedule.create({
    ...scheduleData,
    userId,
    startDate,
    endDate,
    nextScheduledAt: startDate,
  });
  
  return schedule;
};

/**
 * Get recurring schedules for location
 */
export const getRecurringSchedules = async (userId, locationId = null) => {
  const query = { userId };
  if (locationId) query.locationId = locationId;
  
  return GbpRecurringSchedule.find(query).sort({ createdAt: -1 });
};

/**
 * Update recurring schedule
 */
export const updateRecurringSchedule = async (userId, scheduleId, updates) => {
  const schedule = await GbpRecurringSchedule.findOne({ _id: scheduleId, userId });
  if (!schedule) throw { code: 404, message: "Schedule not found" };
  
  Object.assign(schedule, updates);
  await schedule.save();
  
  return schedule;
};

/**
 * Pause/Resume recurring schedule
 */
export const toggleRecurringSchedule = async (userId, scheduleId, pause = true) => {
  const schedule = await GbpRecurringSchedule.findOne({ _id: scheduleId, userId });
  if (!schedule) throw { code: 404, message: "Schedule not found" };
  
  schedule.status = pause ? "paused" : "active";
  await schedule.save();
  
  return schedule;
};

/**
 * Delete recurring schedule
 */
export const deleteRecurringSchedule = async (userId, scheduleId) => {
  const schedule = await GbpRecurringSchedule.findOne({ _id: scheduleId, userId });
  if (!schedule) throw { code: 404, message: "Schedule not found" };
  
  schedule.status = "cancelled";
  await schedule.save();
  
  return schedule;
};

/**
 * Get location posting settings
 */
export const getLocationSettings = async (userId, locationId) => {
  let settings = await GbpLocationSettings.findOne({ userId, locationId });
  
  if (!settings) {
    // Create default settings
    settings = await GbpLocationSettings.create({
      userId,
      locationId,
      postsPerWeek: 3,
      timezone: "Asia/Kolkata",
      businessTone: "professional",
    });
  }
  
  return settings;
};

/**
 * Update location posting settings
 */
export const updateLocationSettings = async (userId, locationId, updates) => {
  const settings = await GbpLocationSettings.findOneAndUpdate(
    { userId, locationId },
    { $set: updates },
    { upsert: true, new: true }
  );
  
  return settings;
};

/**
 * Pause/Resume location scheduling
 */
export const toggleLocationScheduling = async (userId, locationId, pause = true) => {
  const settings = await getLocationSettings(userId, locationId);
  
  settings.isPaused = pause;
  settings.pausedAt = pause ? new Date() : null;
  await settings.save();
  
  return settings;
};
