// components/skills-gap/ResultsSection.tsx
'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { AnalysisResult, SkillGap } from '@/app/career/tools/skill-gap-analysis/page';

interface ResultsSectionProps {
  result: AnalysisResult;
  activeTab: 'overview' | 'gaps' | 'recommendations' | 'optimization';
  setActiveTab: (tab: 'overview' | 'gaps' | 'recommendations' | 'optimization') => void;
  filterStatus: 'all' | 'matched' | 'partial' | 'missing';
  setFilterStatus: (status: 'all' | 'matched' | 'partial' | 'missing') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredGaps: SkillGap[];
  stats: { matched: number; partial: number; missing: number; bonus: number } | null;
  getStatusColor: (status: string) => string;
  getImportanceBadge: (importance: string) => string;
  getMatchColor: (percentage: number) => string;
}

const ResultsSection = memo(function ResultsSection({
  result,
  activeTab,
  setActiveTab,
  filterStatus,
  setFilterStatus,
  selectedCategory,
  setSelectedCategory,
  filteredGaps,
  stats,
  getStatusColor,
  getImportanceBadge,
  getMatchColor,
}: ResultsSectionProps) {
  return (
    <>
      {/* Overall Score Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Match Score */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.overallMatch / 100)}`}
                  className={`${getMatchColor(result.overallMatch)} transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{result.overallMatch}%</span>
                <span className="text-xs text-gray-500">Match Rate</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Skill Breakdown</h4>
            
            {[
              { label: 'Matched', count: stats?.matched || 0, color: 'bg-green-500' },
              { label: 'Partial', count: stats?.partial || 0, color: 'bg-yellow-500' },
              { label: 'Missing', count: stats?.missing || 0, color: 'bg-red-500' },
              { label: 'Bonus', count: stats?.bonus || 0, color: 'bg-blue-500' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{stat.count}</span>
              </div>
            ))}
          </div>
          
          {/* Key Strengths & Gaps */}
          <div className="space-y-3">
            {result.keyStrengths.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Key Strengths</h4>
                <ul className="space-y-1">
                  {result.keyStrengths.slice(0, 3).map((strength, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start space-x-1">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.criticalGaps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Critical Gaps</h4>
                <ul className="space-y-1">
                  {result.criticalGaps.slice(0, 3).map((gap, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start space-x-1">
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'gaps', label: 'Skill Gaps', icon: '🔍' },
          { id: 'recommendations', label: 'Recommendations', icon: '💡' },
          { id: 'optimization', label: 'Optimization', icon: '🎯' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.categorySummary
                .filter(cat => cat.total > 0)
                .map((cat, i) => (
                  <div key={i} className="bg-gray-950 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-300 capitalize">{cat.category}</h4>
                      <span className="text-lg font-bold text-white">{cat.percentage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getMatchColor(cat.percentage)} transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-green-400 font-semibold text-sm">{cat.matched}</div>
                        <div className="text-xs text-gray-500">Matched</div>
                      </div>
                      <div>
                        <div className="text-yellow-400 font-semibold text-sm">{cat.partial}</div>
                        <div className="text-xs text-gray-500">Partial</div>
                      </div>
                      <div>
                        <div className="text-red-400 font-semibold text-sm">{cat.missing}</div>
                        <div className="text-xs text-gray-500">Missing</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Skills Gaps Tab */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="matched">✅ Matched</option>
                <option value="partial">⚠️ Partial</option>
                <option value="missing">❌ Missing</option>
              </select>
              
              <select
                className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="soft">Soft Skills</option>
                <option value="tool">Tools</option>
                <option value="certification">Certifications</option>
              </select>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGaps.map((gap, i) => (
                <div key={i} className="bg-gray-950 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">{gap.skill}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(gap.status)}`}>
                        {gap.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getImportanceBadge(gap.importance)}`}>
                        {gap.importance}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300">{gap.matchPercentage}%</span>
                  </div>
                  
                  {gap.status !== 'bonus' && (
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${getMatchColor(gap.matchPercentage)}`}
                        style={{ width: `${gap.matchPercentage}%` }}
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">{gap.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="bg-gray-950 rounded-xl p-5 border border-gray-800">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 p-2 rounded-lg ${
                    rec.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{rec.action}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">
                      <span className="text-gray-500">Impact:</span> {rec.impact}
                    </p>
                    
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Timeline:</span> {rec.timeframe}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* CTA Card */}
            <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-600/20 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-2">Need Help Closing These Gaps?</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get personalized guidance with our ATS Resume Kit and mentorship sessions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://hugoclaw.gumroad.com/l/ats-kit?from=skillsgap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 px-4 rounded-xl text-center transition-all"
                >
                  Get ATS Resume Kit
                </a>
                
                <Link
                  href="/mentorship"
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2 px-4 rounded-xl text-center transition-all"
                >
                  Book Mentorship Session
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Missing Keywords to Add</h4>
              <div className="flex flex-wrap gap-2">
                {result.keywordOptimization.missingKeywords.map((kw, i) => (
                  <span key={i} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Resume Optimization Suggestions</h4>
              <ul className="space-y-2">
                {result.keywordOptimization.suggestedAdditions.map((suggestion, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">ATS Tip</h4>
              <p className="text-sm text-gray-400">
                Include exact keywords from the job description in your resume. 
                Many companies use ATS systems that look for specific terms. 
                The more matches you have, the higher your chances of getting an interview.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default ResultsSection;