/**
 * Local SEO Audit Controller
 * Handles all audit-related API endpoints
 */

import { runLocalSEOAudit } from "../../services/gbp/localSEOAudit.service.js";
import LocalSEOAudit from "../../models/gbp/LocalSEOAudit.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";

/**
 * POST /api/google-business-profile/audit/run
 * Run a new Local SEO audit
 */
export const runAudit = async (req, res) => {
  try {
    const { locationId } = req.body;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    console.log(`[Audit API] Running audit for location ${locationId}`);

    // Run the audit
    const auditResult = await runLocalSEOAudit(userId, locationId);

    // Save audit to database
    const audit = await LocalSEOAudit.create({
      userId,
      locationId,
      ...auditResult,
    });

    console.log(`[Audit API] Audit completed with score ${audit.score}/100`);

    res.json({
      success: true,
      audit: {
        id: audit._id,
        score: audit.score,
        summary: audit.summary,
        checks: audit.checks,
        breakdown: audit.breakdown,
        auditedAt: audit.auditedAt,
      },
    });

  } catch (error) {
    console.error('[Audit API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to run audit',
    });
  }
};

/**
 * GET /api/google-business-profile/audit/latest
 * Get latest audit for a location
 */
export const getLatestAudit = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    const audit = await LocalSEOAudit.findOne({
      userId,
      locationId,
    })
    .sort({ auditedAt: -1 })
    .lean();

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'No audit found for this location',
      });
    }

    res.json({
      success: true,
      audit: {
        id: audit._id,
        score: audit.score,
        summary: audit.summary,
        checks: audit.checks,
        breakdown: audit.breakdown,
        auditedAt: audit.auditedAt,
      },
    });

  } catch (error) {
    console.error('[Audit API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get audit',
    });
  }
};

/**
 * GET /api/google-business-profile/audit/history
 * Get audit history for a location
 */
export const getAuditHistory = async (req, res) => {
  try {
    const { locationId, limit = 10 } = req.query;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    const audits = await LocalSEOAudit.find({
      userId,
      locationId,
    })
    .sort({ auditedAt: -1 })
    .limit(parseInt(limit))
    .select('score summary auditedAt')
    .lean();

    // Calculate trend if we have multiple audits
    let trend = null;
    if (audits.length >= 2) {
      const latest = audits[0];
      const previous = audits[1];
      const change = latest.score - previous.score;
      
      trend = {
        current: latest.score,
        previous: previous.score,
        change,
        direction: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
      };
    }

    res.json({
      success: true,
      audits: audits.map(a => ({
        id: a._id,
        score: a.score,
        summary: a.summary,
        auditedAt: a.auditedAt,
      })),
      trend,
    });

  } catch (error) {
    console.error('[Audit API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get audit history',
    });
  }
};

/**
 * GET /api/google-business-profile/audit/compare
 * Compare current audit with previous
 */
export const compareAudits = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    const [current, previous] = await LocalSEOAudit.find({
      userId,
      locationId,
    })
    .sort({ auditedAt: -1 })
    .limit(2)
    .lean();

    if (!current) {
      return res.status(404).json({
        success: false,
        message: 'No audit found',
      });
    }

    if (!previous) {
      return res.json({
        success: true,
        current: {
          score: current.score,
          summary: current.summary,
          auditedAt: current.auditedAt,
        },
        comparison: null,
        message: 'Only one audit available, no comparison possible',
      });
    }

    // Calculate changes
    const scoreChange = current.score - previous.score;
    const criticalChange = current.summary.critical - previous.summary.critical;
    const warningChange = current.summary.warnings - previous.summary.warnings;
    const passedChange = current.summary.passed - previous.summary.passed;

    // Find new issues
    const newIssues = current.checks.filter(currentCheck => {
      const wasPass = previous.checks.find(pc => 
        pc.id === currentCheck.id && pc.status === 'PASS'
      );
      return wasPass && (currentCheck.status === 'WARNING' || currentCheck.status === 'CRITICAL');
    });

    // Find fixed issues
    const fixedIssues = previous.checks.filter(prevCheck => {
      const isNowPass = current.checks.find(cc => 
        cc.id === prevCheck.id && cc.status === 'PASS'
      );
      return isNowPass && (prevCheck.status === 'WARNING' || prevCheck.status === 'CRITICAL');
    });

    res.json({
      success: true,
      current: {
        score: current.score,
        summary: current.summary,
        auditedAt: current.auditedAt,
      },
      previous: {
        score: previous.score,
        summary: previous.summary,
        auditedAt: previous.auditedAt,
      },
      comparison: {
        scoreChange,
        criticalChange,
        warningChange,
        passedChange,
        newIssues: newIssues.map(i => ({ id: i.id, title: i.title, severity: i.severity })),
        fixedIssues: fixedIssues.map(i => ({ id: i.id, title: i.title })),
        trend: scoreChange > 0 ? 'improving' : scoreChange < 0 ? 'declining' : 'stable',
      },
    });

  } catch (error) {
    console.error('[Audit API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to compare audits',
    });
  }
};

/**
 * GET /api/google-business-profile/audit/action-plan
 * Generate AI-powered action plan from audit
 */
export const getActionPlan = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    // Get latest audit
    const audit = await LocalSEOAudit.findOne({
      userId,
      locationId,
    })
    .sort({ auditedAt: -1 })
    .lean();

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'No audit found. Run an audit first.',
      });
    }

    // Get location for context
    const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();

    // Build action plan from audit issues
    const actions = [];

    // Process CRITICAL issues first (HIGH priority)
    const criticalIssues = audit.checks.filter(c => c.status === 'CRITICAL');
    criticalIssues.forEach((issue, index) => {
      if (issue.recommendation) {
        actions.push({
          id: `critical_${index}`,
          priority: 'HIGH',
          category: issue.category,
          issue: issue.title,
          description: issue.description,
          whyItMatters: issue.whyItMatters,
          recommendation: issue.recommendation,
          actionRoute: issue.actionRoute,
          evidence: issue.evidence,
          estimatedImpact: 'High - Critical for local SEO',
        });
      }
    });

    // Process WARNING issues (MEDIUM priority)
    const warningIssues = audit.checks.filter(c => c.status === 'WARNING');
    warningIssues.forEach((issue, index) => {
      if (issue.recommendation) {
        actions.push({
          id: `warning_${index}`,
          priority: 'MEDIUM',
          category: issue.category,
          issue: issue.title,
          description: issue.description,
          whyItMatters: issue.whyItMatters,
          recommendation: issue.recommendation,
          actionRoute: issue.actionRoute,
          evidence: issue.evidence,
          estimatedImpact: 'Medium - Improves visibility',
        });
      }
    });

    // Prioritize actions
    const prioritizedActions = actions.slice(0, 10); // Top 10 actions

    res.json({
      success: true,
      actionPlan: {
        locationName: location.locationName,
        totalActions: prioritizedActions.length,
        highPriority: prioritizedActions.filter(a => a.priority === 'HIGH').length,
        mediumPriority: prioritizedActions.filter(a => a.priority === 'MEDIUM').length,
        actions: prioritizedActions,
        auditScore: audit.score,
        auditDate: audit.auditedAt,
      },
    });

  } catch (error) {
    console.error('[Action Plan API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate action plan',
    });
  }
};

/**
 * GET /api/google-business-profile/audit/fix-queue
 * Get comprehensive fix queue for "Fix Everything" feature
 */
export const getFixQueue = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }

    // Get latest audit
    const audit = await LocalSEOAudit.findOne({
      userId,
      locationId,
    })
    .sort({ auditedAt: -1 })
    .lean();

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'No audit found. Run an audit first.',
      });
    }

    // Get location for context
    const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();

    // Build fix queue
    const fixableIssues = audit.checks.filter(
      c => (c.status === 'CRITICAL' || c.status === 'WARNING') && c.actionRoute
    );

    // Group by category
    const grouped = {};
    fixableIssues.forEach(issue => {
      if (!grouped[issue.category]) {
        grouped[issue.category] = [];
      }
      grouped[issue.category].push({
        id: issue.id,
        title: issue.title,
        severity: issue.severity,
        status: issue.status,
        description: issue.description,
        recommendation: issue.recommendation,
        actionRoute: issue.actionRoute,
        currentValue: issue.currentValue,
        expectedValue: issue.expectedValue,
      });
    });

    res.json({
      success: true,
      fixQueue: {
        locationName: location.locationName,
        totalIssues: fixableIssues.length,
        criticalCount: fixableIssues.filter(i => i.status === 'CRITICAL').length,
        warningCount: fixableIssues.filter(i => i.status === 'WARNING').length,
        groupedByCategory: grouped,
        auditScore: audit.score,
        potentialScoreIncrease: Math.min(100 - audit.score, fixableIssues.length * 5), // Estimate
      },
    });

  } catch (error) {
    console.error('[Fix Queue API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get fix queue',
    });
  }
};

export default {
  runAudit,
  getLatestAudit,
  getAuditHistory,
  compareAudits,
  getActionPlan,
  getFixQueue,
};
