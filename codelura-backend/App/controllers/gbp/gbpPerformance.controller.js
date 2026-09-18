import { fetchPerformanceMetrics, getStoredMetrics, fetchSearchKeywords } from "../../services/gbp/gbpPerformance.service.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";

export const getPerformance = async (req, res) => {
  try {
    const { startDate, endDate, refresh } = req.query;
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const end = endDate || new Date().toISOString().split("T")[0];

    if (refresh === "true") {
      const { dailyMap, errors } = await fetchPerformanceMetrics(req.user._id, req.params.locationId, start, end);
      return res.json({ success: true, data: dailyMap, errors });
    }

    const metrics = await getStoredMetrics(req.user._id, req.params.locationId, start, end);
    if (metrics.length === 0) {
      const { dailyMap, errors } = await fetchPerformanceMetrics(req.user._id, req.params.locationId, start, end);
      return res.json({ success: true, data: dailyMap, errors });
    }
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const getKeywords = async (req, res) => {
  try {
    const { month = new Date().toISOString().slice(0, 7), refresh } = req.query;
    
    console.log(`getKeywords - locationId: ${req.params.locationId}, month: ${month}, refresh: ${refresh}`);
    
    // Check for stored data first
    const stored = await GbpSearchKeyword.findOne({ 
      locationId: req.params.locationId, 
      month 
    }).sort({ createdAt: -1 });
    
    // Determine if we need to fetch fresh data
    const needsFreshData = !stored || // No stored data
                          refresh === "true" || // Force refresh requested
                          !stored.keywords || // Keywords field missing
                          stored.keywords.length === 0 || // Empty keywords array
                          (Date.now() - new Date(stored.updatedAt).getTime() > 24 * 60 * 60 * 1000); // Data older than 24 hours
    
    if (needsFreshData) {
      console.log(`Fetching fresh data - Reason: ${!stored ? 'no stored data' : refresh === "true" ? 'force refresh' : stored.keywords?.length === 0 ? 'empty stored data' : 'data too old'}`);
      
      const keywords = await fetchSearchKeywords(req.user._id, req.params.locationId, month);
      return res.json({ 
        success: true, 
        data: keywords,
        count: keywords.length,
        source: 'fresh',
        message: keywords.length === 0 ? "No keyword data available for this period. This may be due to insufficient search impressions on your Google Business Profile location." : undefined
      });
    }
    
    console.log(`Returning stored keywords: ${stored.keywords?.length || 0} items`);
    res.json({ 
      success: true, 
      data: stored.keywords || [],
      count: stored.keywords?.length || 0,
      source: 'cached',
      lastUpdated: stored.updatedAt
    });
    
  } catch (err) {
    console.error(`Error in getKeywords:`, err);
    const statusCode = typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500);
    res.status(statusCode).json({ 
      success: false, 
      message: err.message,
      details: err.details || undefined
    });
  }
};
