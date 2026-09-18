/**
 * Timezone utilities for GBP Scheduler
 * Stores all dates in UTC, displays in user timezone (default: Asia/Kolkata)
 */

/**
 * Convert local datetime to UTC for storage
 * @param {string} date - "2026-09-20"
 * @param {string} time - "10:00"
 * @param {string} timezone - "Asia/Kolkata"
 * @returns {Date} UTC Date object
 */
export const toUTC = (date, time, timezone = "Asia/Kolkata") => {
  // Construct datetime string in ISO format
  const dateTimeStr = `${date}T${time}:00`;
  
  // Parse as local time in the specified timezone
  // For Asia/Kolkata (UTC+5:30), we need to subtract the offset
  const localDate = new Date(dateTimeStr);
  
  // Get timezone offset for Asia/Kolkata
  const offset = getTimezoneOffset(timezone);
  
  // Convert to UTC
  const utcDate = new Date(localDate.getTime() - offset);
  
  return utcDate;
};

/**
 * Convert UTC to local timezone for display
 * @param {Date} utcDate - UTC Date object
 * @param {string} timezone - "Asia/Kolkata"
 * @returns {object} { date: "2026-09-20", time: "10:00", dateTime: "2026-09-20T10:00" }
 */
export const fromUTC = (utcDate, timezone = "Asia/Kolkata") => {
  if (!utcDate) return null;
  
  const offset = getTimezoneOffset(timezone);
  const localDate = new Date(utcDate.getTime() + offset);
  
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const hours = String(localDate.getUTCHours()).padStart(2, '0');
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
    dateTime: `${year}-${month}-${day}T${hours}:${minutes}`,
    formatted: `${day}/${month}/${year} ${hours}:${minutes}`
  };
};

/**
 * Get timezone offset in milliseconds
 * @param {string} timezone - "Asia/Kolkata"
 * @returns {number} Offset in milliseconds
 */
const getTimezoneOffset = (timezone) => {
  const offsets = {
    "Asia/Kolkata": 5.5 * 60 * 60 * 1000,  // UTC+5:30
    "Asia/Calcutta": 5.5 * 60 * 60 * 1000,
    "IST": 5.5 * 60 * 60 * 1000,
    "Asia/Dubai": 4 * 60 * 60 * 1000,      // UTC+4:00
    "UTC": 0,
  };
  
  return offsets[timezone] || offsets["Asia/Kolkata"];
};

/**
 * Format date for display
 * @param {Date} date - Date object
 * @param {string} timezone - "Asia/Kolkata"
 * @returns {string} "20 Sep 2026, 10:00 AM"
 */
export const formatDateTime = (date, timezone = "Asia/Kolkata") => {
  if (!date) return "";
  
  const local = fromUTC(date, timezone);
  if (!local) return "";
  
  const [year, month, day] = local.date.split('-');
  const [hours, minutes] = local.time.split(':');
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = monthNames[parseInt(month) - 1];
  
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  
  return `${day} ${monthName} ${year}, ${hour12}:${minutes} ${ampm}`;
};

/**
 * Get current time in specified timezone
 * @param {string} timezone - "Asia/Kolkata"
 * @returns {Date} Current UTC Date
 */
export const now = (timezone = "Asia/Kolkata") => {
  return new Date();
};

/**
 * Check if date is in the past
 * @param {Date} date - UTC Date object
 * @returns {boolean}
 */
export const isPast = (date) => {
  return date < new Date();
};

/**
 * Add days to date
 * @param {Date} date - Date object
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Validate timezone
 * @param {string} timezone
 * @returns {boolean}
 */
export const isValidTimezone = (timezone) => {
  const valid = ["Asia/Kolkata", "Asia/Calcutta", "IST", "Asia/Dubai", "UTC"];
  return valid.includes(timezone);
};
