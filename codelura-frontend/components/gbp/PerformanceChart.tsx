// Lazy-loaded Performance Chart Component
import React from "react";

interface ChartData {
  date: string;
  searchImpressions: number;
  mapsImpressions: number;
  calls: number;
  websiteClicks: number;
}

interface PerformanceChartProps {
  data: any[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No performance data available for the selected period.
      </div>
    );
  }

  // Process data for chart
  const chartData: ChartData[] = data.map((item: any) => {
    const m = item.metrics || {};
    return {
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      searchImpressions: (m.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) + (m.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0),
      mapsImpressions: (m.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) + (m.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0),
      calls: m.CALL_CLICKS || 0,
      websiteClicks: m.WEBSITE_CLICKS || 0,
    };
  });

  // Calculate max values for scaling
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.searchImpressions, d.mapsImpressions, d.calls, d.websiteClicks))
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Search & Maps Impressions</h3>
        <div className="h-64 flex items-end gap-1">
          {chartData.map((item, i) => {
            const searchHeight = (item.searchImpressions / maxValue) * 100;
            const mapsHeight = (item.mapsImpressions / maxValue) * 100;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5" style={{ height: '200px' }}>
                  <div 
                    className="flex-1 bg-gradient-to-t from-purple-600 to-violet-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${searchHeight}%`, alignSelf: 'flex-end' }}
                    title={`Search: ${item.searchImpressions}`}
                  />
                  <div 
                    className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${mapsHeight}%`, alignSelf: 'flex-end' }}
                    title={`Maps: ${item.mapsImpressions}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{item.date}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-600 to-violet-500"></div>
            <span className="text-xs text-slate-400">Search</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-600 to-cyan-500"></div>
            <span className="text-xs text-slate-400">Maps</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">User Actions</h3>
        <div className="h-48 flex items-end gap-2">
          {chartData.map((item, i) => {
            const callsHeight = (item.calls / maxValue) * 100;
            const clicksHeight = (item.websiteClicks / maxValue) * 100;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1" style={{ height: '160px' }}>
                  <div 
                    className="flex-1 bg-gradient-to-t from-emerald-600 to-green-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${callsHeight}%`, alignSelf: 'flex-end' }}
                    title={`Calls: ${item.calls}`}
                  />
                  <div 
                    className="flex-1 bg-gradient-to-t from-orange-600 to-amber-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${clicksHeight}%`, alignSelf: 'flex-end' }}
                    title={`Website: ${item.websiteClicks}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{item.date}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-600 to-green-500"></div>
            <span className="text-xs text-slate-400">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-600 to-amber-500"></div>
            <span className="text-xs text-slate-400">Website Clicks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
