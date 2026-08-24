// app/resume-templates/page.tsx
'use client';

import { useMemo, useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { templates } from '@/lib/resume-templates/template-data';
import type { ResumeTemplate, TemplateCategory, TemplateColor, TemplateLayout } from '@/lib/resume-templates/type';

// Lazy load the SVG preview component
const TemplatePreviewSVG = dynamic(
  () => import('@/components/career/resume-templates/TemplatePreviewSVG'),
  { 
    loading: () => <div className="w-full h-full bg-gray-800/50 animate-pulse rounded" />,
    ssr: false 
  }
);

// Constants
const ALL_CATEGORIES: TemplateCategory[] = ['modern', 'classic', 'creative', 'minimal', 'executive', 'tech', 'ats'];
const ALL_COLORS: TemplateColor[] = ['blue', 'green', 'purple', 'red', 'teal', 'orange', 'gray', 'black'];
const ALL_LAYOUTS: TemplateLayout[] = ['single-column', 'two-column', 'sidebar', 'hybrid'];

// Category icons - moved outside for better performance
const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  modern: '🎨',
  classic: '📜',
  creative: '✨',
  minimal: '◽',
  executive: '👔',
  tech: '💻',
  ats: '🤖',
};

const LAYOUT_ICONS: Record<TemplateLayout, string> = {
  'single-column': '📄',
  'two-column': '📰',
  sidebar: '📑',
  hybrid: '📋',
};

const COLOR_MAP: Record<TemplateColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  gray: 'bg-gray-500',
  black: 'bg-black',
};

// Utility functions
const getCategoryIcon = (category: TemplateCategory): string => CATEGORY_ICONS[category] || '📄';
const getLayoutIcon = (layout: TemplateLayout): string => LAYOUT_ICONS[layout] || '📄';
const getColorDot = (color: TemplateColor): string => COLOR_MAP[color] || 'bg-gray-500';

const getATSScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-yellow-400';
  if (score >= 70) return 'text-orange-400';
  return 'text-red-400';
};

// Memoized Template Card Component
const TemplateCard = ({ 
  template, 
  onPreview, 
  onUse,
  getATSScoreColor,
  getColorDot,
  getCategoryIcon,
  getLayoutIcon,
  viewMode = 'grid'
}: { 
  template: ResumeTemplate;
  onPreview: (template: ResumeTemplate) => void;
  onUse: (template: ResumeTemplate) => void;
  getATSScoreColor: (score: number) => string;
  getColorDot: (color: TemplateColor) => string;
  getCategoryIcon: (category: TemplateCategory) => string;
  getLayoutIcon: (layout: TemplateLayout) => string;
  viewMode?: 'grid' | 'list';
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-600/30 transition-all group">
        <div
          className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-950"
          onClick={() => onPreview(template)}
        >
          <Suspense fallback={<div className="w-full h-full bg-gray-800/50 animate-pulse" />}>
            <TemplatePreviewSVG config={template.config} />
          </Suspense>

          {template.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              PRO
            </div>
          )}

          <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium">Preview</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-white font-semibold text-sm">{template.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {feature}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <span className={`text-xs font-semibold ${getATSScoreColor(template.atsScore)}`}>
              ATS {template.atsScore}%
            </span>
            <div className="flex items-center space-x-1">
              {template.colors.map((color) => (
                <div key={color} className={`w-2.5 h-2.5 rounded-full ${getColorDot(color)}`} />
              ))}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUse(template);
            }}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 rounded-xl transition-all"
          >
            Use This Template
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-violet-600/30 transition-all group cursor-pointer"
      onClick={() => onPreview(template)}
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700/50 bg-gray-950">
          <Suspense fallback={<div className="w-full h-full bg-gray-800/50 animate-pulse" />}>
            <TemplatePreviewSVG config={template.config} />
          </Suspense>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{template.name}</h3>
            {template.isPremium && (
              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{template.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-gray-500 capitalize">
              {getCategoryIcon(template.category)} {template.category}
            </span>
            <span className="text-gray-500">
              {getLayoutIcon(template.layout)} {template.layout.replace('-', ' ')}
            </span>
            <span className={`font-semibold ${getATSScoreColor(template.atsScore)}`}>ATS {template.atsScore}%</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < template.popularity ? 'text-yellow-400' : 'text-gray-600'}>
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {template.features.slice(0, 4).map((feature, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUse(template);
          }}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all flex-shrink-0"
        >
          Use Template
        </button>
      </div>
    </div>
  );
};

// Memoized Preview Modal
const PreviewModal = ({ 
  template, 
  onClose, 
  onUse,
  getATSScoreColor,
  getColorDot,
  getCategoryIcon,
  getLayoutIcon
}: {
  template: ResumeTemplate | null;
  onClose: () => void;
  onUse: (template: ResumeTemplate) => void;
  getATSScoreColor: (score: number) => string;
  getColorDot: (color: TemplateColor) => string;
  getCategoryIcon: (category: TemplateCategory) => string;
  getLayoutIcon: (layout: TemplateLayout) => string;
}) => {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{template.name}</h2>
            <p className="text-sm text-gray-400">{template.description}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Close preview"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl overflow-hidden border border-gray-700 max-h-96 aspect-[3/4] mx-auto max-w-sm bg-gray-950">
            <Suspense fallback={<div className="w-full h-full bg-gray-800/50 animate-pulse" />}>
              <TemplatePreviewSVG config={template.config} />
            </Suspense>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Category</h4>
                <span className="inline-flex items-center space-x-1.5 bg-gray-800 rounded-full px-3 py-1 text-sm text-gray-300 capitalize">
                  {getCategoryIcon(template.category)} {template.category}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Layout</h4>
                <span className="inline-flex items-center space-x-1.5 bg-gray-800 rounded-full px-3 py-1 text-sm text-gray-300 capitalize">
                  {getLayoutIcon(template.layout)} {template.layout.replace('-', ' ')}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Colors</h4>
                <div className="flex gap-1.5">
                  {template.colors.map((color) => (
                    <div key={color} className="flex items-center space-x-1.5 bg-gray-800 rounded-full px-3 py-1">
                      <div className={`w-3 h-3 rounded-full ${getColorDot(color)}`} />
                      <span className="text-xs text-gray-300 capitalize">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Features</h4>
                <ul className="space-y-1">
                  {template.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="text-violet-400">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Best For</h4>
                <div className="flex flex-wrap gap-1">
                  {template.bestFor.map((role, i) => (
                    <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                onClose();
                onUse(template);
              }}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Use This Template in Builder
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 text-gray-400 rounded-xl hover:text-white hover:border-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function ResumeTemplatesPage() {
  const router = useRouter();

  // State
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedColor, setSelectedColor] = useState<TemplateColor | 'all'>('all');
  const [selectedLayout, setSelectedLayout] = useState<TemplateLayout | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'atsScore' | 'name'>('popularity');

  // Memoized filtered and sorted templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => {
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (selectedColor !== 'all' && !t.colors.includes(selectedColor)) return false;
        if (selectedLayout !== 'all' && t.layout !== selectedLayout) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return t.name.toLowerCase().includes(query) || 
                 t.description.toLowerCase().includes(query) ||
                 t.features.some(f => f.toLowerCase().includes(query)) ||
                 t.bestFor.some(b => b.toLowerCase().includes(query));
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return b.popularity - a.popularity;
        if (sortBy === 'atsScore') return b.atsScore - a.atsScore;
        return a.name.localeCompare(b.name);
      });
  }, [selectedCategory, selectedColor, selectedLayout, searchQuery, sortBy]);

  // Memoized stats
  const stats = useMemo(() => ({
    total: templates.length,
    categories: ALL_CATEGORIES.length,
    colors: ALL_COLORS.length,
    maxATSScore: Math.max(...templates.map((t) => t.atsScore)),
  }), []);

  // Handlers with useCallback
  const handleUseTemplate = useCallback((template: ResumeTemplate) => {
    try {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template.config));
      sessionStorage.setItem('templateName', template.name);
      router.push('/career/tools/resume-builder');
    } catch (error) {
      console.error('Failed to save template selection:', error);
      // Fallback: open builder without template
      router.push('/career/tools/resume-builder');
    }
  }, [router]);

  const handlePreview = useCallback((template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setSelectedTemplate(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedLayout('all');
    setSearchQuery('');
  }, []);

  // Memoized category buttons
  const categoryButtons = useMemo(() => {
    return ALL_CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm capitalize transition-all ${
          selectedCategory === cat ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <span>{getCategoryIcon(cat)}</span>
        <span>{cat === 'ats' ? 'ATS' : cat}</span>
      </button>
    ));
  }, [selectedCategory]);

  // Memoized color buttons
  const colorButtons = useMemo(() => {
    return ALL_COLORS.map((color) => (
      <button
        key={color}
        onClick={() => setSelectedColor(color)}
        className={`w-6 h-6 rounded-full transition-all ${getColorDot(color)} ${
          selectedColor === color ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''
        }`}
        title={color}
        aria-label={`Filter by ${color} color`}
      />
    ));
  }, [selectedColor]);

  // Memoized layout buttons
  const layoutButtons = useMemo(() => {
    return ALL_LAYOUTS.map((layout) => (
      <button
        key={layout}
        onClick={() => setSelectedLayout(layout)}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs transition-all ${
          selectedLayout === layout ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40' : 'text-gray-500 border border-gray-700'
        }`}
      >
        <span>{getLayoutIcon(layout)}</span>
        <span className="capitalize">{layout.replace('-', ' ')}</span>
      </button>
    ));
  }, [selectedLayout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section - Static content */}
        <header className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center space-x-2 bg-violet-600/10 border border-violet-600/20 rounded-full px-4 py-2 mb-6">
            <span className="text-lg">📄</span>
            <span className="text-sm text-violet-300">{stats.total}+ Professional Templates</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">
              Resume Templates
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose a template and customize it in our builder. Click &ldquo;Use Template&rdquo; to start editing with
            your content.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-violet-400 font-bold">{stats.total}+</span>
              <span className="text-gray-500">Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-violet-400 font-bold">{stats.categories}</span>
              <span className="text-gray-500">Categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-violet-400 font-bold">{stats.colors}</span>
              <span className="text-gray-500">Color Schemes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-violet-400 font-bold">{stats.maxATSScore}%</span>
              <span className="text-gray-500">ATS Compatible</span>
            </div>
          </div>
        </header>

        {/* Filters Section - Optimized */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name, features, or best for..."
                aria-label="Search templates"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveView('grid')}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  activeView === 'grid' ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40' : 'text-gray-500 border border-gray-700 hover:border-gray-600'
                }`}
                aria-label="Grid view"
              >
                ▦ Grid
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  activeView === 'list' ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40' : 'text-gray-500 border border-gray-700 hover:border-gray-600'
                }`}
                aria-label="List view"
              >
                ☰ List
              </button>
              <select
                className="bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort templates"
              >
                <option value="popularity">Most Popular</option>
                <option value="atsScore">Highest ATS Score</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Templates
            </button>
            {categoryButtons}
          </div>

          {/* Color & Layout Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <button
                onClick={() => setSelectedColor('all')}
                className={`w-6 h-6 rounded-full border-2 border-dashed border-gray-500 transition-all ${
                  selectedColor === 'all' ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''
                }`}
                title="All colors"
                aria-label="All colors"
              />
              {colorButtons}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Layout:</span>
              <button
                onClick={() => setSelectedLayout('all')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                  selectedLayout === 'all' ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40' : 'text-gray-500 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <span>All</span>
              </button>
              {layoutButtons}
            </div>
          </div>

          {/* Active filters summary */}
          {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedLayout !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800">
              <span className="text-xs text-gray-500">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full flex items-center gap-1">
                  {getCategoryIcon(selectedCategory)} {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-white">×</button>
                </span>
              )}
              {selectedColor !== 'all' && (
                <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${getColorDot(selectedColor)}`} />
                  {selectedColor}
                  <button onClick={() => setSelectedColor('all')} className="hover:text-white">×</button>
                </span>
              )}
              {selectedLayout !== 'all' && (
                <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full flex items-center gap-1">
                  {getLayoutIcon(selectedLayout)} {selectedLayout.replace('-', ' ')}
                  <button onClick={() => setSelectedLayout('all')} className="hover:text-white">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white">×</button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-white transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="text-white font-semibold">{filteredTemplates.length}</span> templates
          </p>
          {filteredTemplates.length > 0 && activeView === 'grid' && (
            <span className="text-xs text-gray-500">
              {Math.ceil(filteredTemplates.length / 4)} pages
            </span>
          )}
        </div>

        {/* Template Grid/List - Optimized with memoized cards */}
        {filteredTemplates.length > 0 ? (
          activeView === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                  getATSScoreColor={getATSScoreColor}
                  getColorDot={getColorDot}
                  getCategoryIcon={getCategoryIcon}
                  getLayoutIcon={getLayoutIcon}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                  getATSScoreColor={getATSScoreColor}
                  getColorDot={getColorDot}
                  getCategoryIcon={getCategoryIcon}
                  getLayoutIcon={getLayoutIcon}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
            <button 
              onClick={clearFilters} 
              className="mt-4 text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            template={selectedTemplate}
            onClose={handleClosePreview}
            onUse={handleUseTemplate}
            getATSScoreColor={getATSScoreColor}
            getColorDot={getColorDot}
            getCategoryIcon={getCategoryIcon}
            getLayoutIcon={getLayoutIcon}
          />
        )}

        {/* CTA Section - Static */}
        <div className="mt-12 bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-600/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want All Templates?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            Get full access to all {stats.total}+ templates with premium customization options.
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-violet-600/25 transition-all"
          >
            <span>Get All Templates - $12</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}