// app/skills-gap-analyzer/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { tokens, STOP } from '@/lib/score';

// Types
export interface SkillGap {
  skill: string;
  category: 'technical' | 'soft' | 'tool' | 'certification' | 'domain';
  status: 'matched' | 'partial' | 'missing' | 'bonus';
  importance: 'critical' | 'important' | 'nice-to-have';
  resumeEvidence: string;
  jobRequirement: string;
  matchPercentage: number;
  recommendation: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  matched: number;
  partial: number;
  missing: number;
  percentage: number;
}

export  interface AnalysisResult {
  overallMatch: number;
  skillGaps: SkillGap[];
  categorySummary: CategorySummary[];
  keyStrengths: string[];
  criticalGaps: string[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeframe: string;
  }[];
  keywordOptimization: {
    missingKeywords: string[];
    suggestedAdditions: string[];
  };
}

// Lazy load heavy components
const ResultsSection = dynamic(() => import('./ResultsSection'), {
  loading: () => <ResultsSkeleton />,
  ssr: false,
});

const ResultsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="h-32 bg-gray-800/50 rounded-xl"></div>
        <div className="h-32 bg-gray-800/50 rounded-xl"></div>
        <div className="h-32 bg-gray-800/50 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// Memoized skill extraction function
const useSkillExtractor = () => {
  return useCallback((text: string): string[] => {
    if (!text.trim()) return [];
    
    const cleaned = text.toLowerCase().replace(/[^a-z0-9+#.\-\s]/g, ' ');
    const words = cleaned.split(/\s+/);
    
    const multiWordSkills = [
      'machine learning', 'deep learning', 'data science', 'project management',
      'product management', 'software development', 'web development', 'mobile development',
      'cloud computing', 'devops', 'continuous integration', 'continuous deployment',
      'version control', 'agile methodology', 'scrum master', 'product owner',
      'user experience', 'user interface', 'quality assurance', 'business intelligence',
      'data analytics', 'big data', 'artificial intelligence', 'natural language processing',
      'computer vision', 'blockchain', 'internet of things', 'cyber security'
    ];
    
    const foundSkills = new Set<string>();
    
    multiWordSkills.forEach(skill => {
      if (cleaned.includes(skill)) {
        foundSkills.add(skill);
      }
    });
    
    const tk = tokens(cleaned).filter(w => 
      w.length > 2 && !STOP.has(w) && 
      !['the', 'and', 'for', 'with', 'that', 'this', 'from'].includes(w)
    );
    
    tk.forEach(skill => foundSkills.add(skill));
    
    return Array.from(foundSkills);
  }, []);
};

// Memoized match calculator
const useMatchCalculator = () => {
  const levenshtein = useCallback((a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return matrix[a.length][b.length];
  }, []);

  return useCallback((resumeSkill: string, jobSkill: string): number => {
    const r = resumeSkill.toLowerCase().trim();
    const j = jobSkill.toLowerCase().trim();
    
    if (r === j) return 100;
    if (r.includes(j) || j.includes(r)) return 85;
    
    const distance = levenshtein(r, j);
    const maxLen = Math.max(r.length, j.length);
    const similarity = ((maxLen - distance) / maxLen) * 100;
    
    return Math.round(similarity);
  }, [levenshtein]);
};

// Industry skills data
const INDUSTRY_SKILLS = {
  tech: {
    critical: ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes', 'sql', 'git', 'agile'],
    important: ['typescript', 'graphql', 'mongodb', 'postgresql', 'redis', 'ci/cd', 'rest api', 'microservices'],
    nice: ['next.js', 'vue.js', 'angular', 'django', 'flask', 'terraform', 'jenkins', 'figma']
  },
  finance: {
    critical: ['excel', 'financial modeling', 'bloomberg', 'sql', 'python', 'risk analysis', 'valuation'],
    important: ['tableau', 'power bi', 'vba', 'quantitative analysis', 'derivatives', 'portfolio management'],
    nice: ['machine learning', 'r', 'matlab', 'cfa', 'frm', 'quickbooks']
  },
  healthcare: {
    critical: ['hipaa', 'patient care', 'emr/ehr', 'clinical documentation', 'medical terminology'],
    important: ['epic', 'cerner', 'healthcare analytics', 'regulatory compliance', 'telemedicine'],
    nice: ['nlp', 'medical coding', 'population health', 'bioinformatics', 'clinical trials']
  },
  marketing: {
    critical: ['seo', 'sem', 'google analytics', 'content marketing', 'social media', 'email marketing'],
    important: ['hubspot', 'salesforce', 'a/b testing', 'crm', 'marketing automation', 'copywriting'],
    nice: ['adobe creative suite', 'video editing', 'sql', 'marketo', 'pardot', 'pr']
  },
};

export default function SkillsGapAnalyzerPage() {
  // State with proper initialization
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [industry, setIndustry] = useState('tech');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'recommendations' | 'optimization'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'partial' | 'missing'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isClient, setIsClient] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Hooks
  const extractSkills = useSkillExtractor();
  const calculateMatch = useMatchCalculator();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Categorize skill with memoization
  const categorizeSkill = useCallback((skill: string): { category: SkillGap['category']; importance: SkillGap['importance'] } => {
    const technicalKeywords = ['programming', 'development', 'engineering', 'architecture', 'database', 'api', 'algorithm'];
    const toolKeywords = ['tool', 'platform', 'software', 'suite', 'system', 'application', 'service'];
    const softKeywords = ['communication', 'leadership', 'management', 'teamwork', 'collaboration', 'problem-solving'];
    const certKeywords = ['certified', 'certification', 'certificate', 'aws certified', 'pmp', 'cfa', 'cpa'];
    
    const skillLower = skill.toLowerCase();
    
    let category: SkillGap['category'] = 'technical';
    if (certKeywords.some(k => skillLower.includes(k))) category = 'certification';
    else if (softKeywords.some(k => skillLower.includes(k))) category = 'soft';
    else if (toolKeywords.some(k => skillLower.includes(k))) category = 'tool';
    else if (technicalKeywords.some(k => skillLower.includes(k))) category = 'technical';
    
    const industryData = INDUSTRY_SKILLS[industry as keyof typeof INDUSTRY_SKILLS] || INDUSTRY_SKILLS.tech;
    let importance: SkillGap['importance'] = 'nice-to-have';
    if (industryData.critical.includes(skillLower)) importance = 'critical';
    else if (industryData.important.includes(skillLower)) importance = 'important';
    
    return { category, importance };
  }, [industry]);

  // Analyze skills gap with debouncing
  const analyzeSkillsGap = useCallback(() => {
    if (!resumeText.trim() || !jobDescription.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    // Use requestIdleCallback for non-critical work
    const analyzeTask = () => {
      const resumeSkills = extractSkills(resumeText);
      const jobSkills = extractSkills(jobDescription);
      
      const skillGaps: SkillGap[] = [];
      const matchedSkills = new Set<string>();
      
      // Process in chunks to avoid blocking UI
      const chunkSize = 10;
      let processed = 0;
      
      const processChunk = () => {
        const chunk = jobSkills.slice(processed, processed + chunkSize);
        
        chunk.forEach(jobSkill => {
          let bestMatch = { skill: '', percentage: 0 };
          
          resumeSkills.forEach(resumeSkill => {
            const matchPct = calculateMatch(resumeSkill, jobSkill);
            if (matchPct > bestMatch.percentage) {
              bestMatch = { skill: resumeSkill, percentage: matchPct };
            }
          });
          
          const { category, importance } = categorizeSkill(jobSkill);
          let status: SkillGap['status'] = 'missing';
          let recommendation = '';
          
          if (bestMatch.percentage >= 85) {
            status = 'matched';
            matchedSkills.add(bestMatch.skill);
            recommendation = `Strong match - highlight this in your application`;
          } else if (bestMatch.percentage >= 60) {
            status = 'partial';
            recommendation = `Consider adding specific examples or certifications for ${jobSkill}`;
          } else {
            status = 'missing';
            if (importance === 'critical') {
              recommendation = `URGENT: Build ${jobSkill} skills through courses or projects`;
            } else {
              recommendation = `Consider learning ${jobSkill} to strengthen your profile`;
            }
          }
          
          skillGaps.push({
            skill: jobSkill,
            category,
            status,
            importance,
            resumeEvidence: bestMatch.percentage >= 60 ? bestMatch.skill : 'Not found',
            jobRequirement: jobSkill,
            matchPercentage: bestMatch.percentage,
            recommendation
          });
        });
        
        processed += chunk.length;
        
        if (processed < jobSkills.length) {
          // Schedule next chunk
          requestIdleCallback(processChunk);
        } else {
          // Process bonus skills
          resumeSkills.forEach(resumeSkill => {
            if (!matchedSkills.has(resumeSkill)) {
              const isRequired = jobSkills.some(js => calculateMatch(resumeSkill, js) >= 60);
              if (!isRequired) {
                const { category } = categorizeSkill(resumeSkill);
                skillGaps.push({
                  skill: resumeSkill,
                  category,
                  status: 'bonus',
                  importance: 'nice-to-have',
                  resumeEvidence: resumeSkill,
                  jobRequirement: 'Not specifically required',
                  matchPercentage: 100,
                  recommendation: 'Bonus skill - mention if relevant to role'
                });
              }
            }
          });
          
          // Calculate summary
          finalizeAnalysis(skillGaps);
        }
      };
      
      const finalizeAnalysis = (gaps: SkillGap[]) => {
        const categories = ['technical', 'soft', 'tool', 'certification', 'domain'];
        const categorySummary: CategorySummary[] = categories.map(cat => {
          const catSkills = gaps.filter(s => s.category === cat && s.status !== 'bonus');
          const total = catSkills.length;
          const matched = catSkills.filter(s => s.status === 'matched').length;
          const partial = catSkills.filter(s => s.status === 'partial').length;
          const missing = catSkills.filter(s => s.status === 'missing').length;
          
          return {
            category: cat,
            total,
            matched,
            partial,
            missing,
            percentage: total > 0 ? Math.round((matched / total) * 100) : 0
          };
        });
        
        const requiredSkills = gaps.filter(s => s.status !== 'bonus');
        const matchedCount = requiredSkills.filter(s => s.status === 'matched').length;
        const partialCount = requiredSkills.filter(s => s.status === 'partial').length;
        const overallMatch = requiredSkills.length > 0 
          ? Math.round(((matchedCount + (partialCount * 0.5)) / requiredSkills.length) * 100)
          : 0;
        
        const keyStrengths = gaps
          .filter(s => s.status === 'matched' && s.importance === 'critical')
          .slice(0, 5)
          .map(s => `Strong match for ${s.skill} (${s.matchPercentage}% match)`);
        
        const criticalGaps = gaps
          .filter(s => s.status === 'missing' && s.importance === 'critical')
          .slice(0, 5)
          .map(s => `Missing critical skill: ${s.skill} - ${s.recommendation}`);
        
        const recommendations = [];
        
        if (criticalGaps.length > 0) {
          recommendations.push({
            priority: 'high' as const,
            action: 'Address critical skill gaps',
            impact: 'Critical for job consideration',
            timeframe: 'Start immediately - 2-4 weeks'
          });
        }
        
        if (gaps.filter(s => s.status === 'partial').length > 3) {
          recommendations.push({
            priority: 'medium' as const,
            action: 'Strengthen partially matched skills',
            impact: 'Significant improvement in match rate',
            timeframe: '1-3 months'
          });
        }
        
        recommendations.push({
          priority: 'low' as const,
          action: 'Add certifications for key skills',
          impact: 'Enhances credibility and ATS score',
          timeframe: '3-6 months'
        });
        
        const missingKeywords = gaps
          .filter(s => s.status === 'missing' && s.importance !== 'nice-to-have')
          .slice(0, 10)
          .map(s => s.skill);
        
        const suggestedAdditions = gaps
          .filter(s => s.status === 'matched')
          .slice(0, 5)
          .map(s => `Emphasize "${s.skill}" with quantifiable achievements`);
        
        const result: AnalysisResult = {
          overallMatch,
          skillGaps: gaps,
          categorySummary,
          keyStrengths,
          criticalGaps,
          recommendations,
          keywordOptimization: {
            missingKeywords,
            suggestedAdditions
          }
        };
        
        setAnalysisResult(result);
        setIsAnalyzing(false);
        
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      };
      
      // Start processing
      processChunk();
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(analyzeTask);
    } else {
      setTimeout(analyzeTask, 100);
    }
  }, [resumeText, jobDescription, industry, extractSkills, calculateMatch, categorizeSkill, isAnalyzing]);

  // Load sample data with memoized values
  const loadSampleData = useCallback(() => {
    const sampleResume = `Senior Software Engineer with 6 years of experience in full-stack development. 
    Proficient in JavaScript, React, Node.js, Python, and AWS. 
    Experienced in building microservices, REST APIs, and working with SQL databases. 
    Led team of 5 developers, implemented CI/CD pipelines, and improved deployment frequency by 40%. 
    Strong problem-solving skills and agile methodology experience.`;
    
    const sampleJob = `We are looking for a Senior Full Stack Developer to join our engineering team.
    Required Skills:
    - 5+ years experience with JavaScript, TypeScript, React, and Node.js
    - Strong knowledge of AWS services (ECS, Lambda, S3, RDS)
    - Experience with Docker, Kubernetes, and microservices architecture
    - Proficiency in PostgreSQL and MongoDB
    - Experience with GraphQL and REST API design
    - CI/CD pipeline management (Jenkins, GitHub Actions)
    - Agile/Scrum methodology
    - Strong communication and leadership skills
    
    Nice to Have:
    - Experience with Next.js and Vue.js
    - Machine learning experience
    - AWS Certification
    - Experience with Terraform`;
    
    setResumeText(sampleResume);
    setJobDescription(sampleJob);
    setJobTitle('Senior Full Stack Developer');
    setExperienceLevel('senior');
    setIndustry('tech');
  }, []);

  // Memoized filtered gaps
  const filteredGaps = useMemo(() => {
    if (!analysisResult) return [];
    return analysisResult.skillGaps.filter(gap => {
      if (filterStatus !== 'all' && gap.status !== filterStatus) return false;
      if (selectedCategory !== 'all' && gap.category !== selectedCategory) return false;
      return true;
    });
  }, [analysisResult, filterStatus, selectedCategory]);

  // Memoized stats
  const stats = useMemo(() => {
    if (!analysisResult) return null;
    return {
      matched: analysisResult.skillGaps.filter(s => s.status === 'matched').length,
      partial: analysisResult.skillGaps.filter(s => s.status === 'partial').length,
      missing: analysisResult.skillGaps.filter(s => s.status === 'missing').length,
      bonus: analysisResult.skillGaps.filter(s => s.status === 'bonus').length,
    };
  }, [analysisResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section - Static content, no performance issues */}
        <header className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center space-x-2 bg-violet-600/10 border border-violet-600/20 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-violet-300">Advanced Skills Gap Analysis</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">
              Skills Gap Analyzer
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Compare your resume against job requirements. Get detailed insights on missing skills, 
            match percentages, and personalized recommendations to land your dream job.
          </p>
        </header>

        {/* Input Section - Optimized with proper event handlers */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Your Resume / Skills</h3>
              <button
                onClick={() => setResumeText('')}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Clear resume text"
              >
                Clear
              </button>
            </div>
            
            <textarea
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 min-h-[250px] resize-y focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text or list your skills here..."
              aria-label="Resume text input"
            />
            
            {resumeText && isClient && (
              <div className="text-xs text-gray-500">
                {extractSkills(resumeText).length} skills detected
              </div>
            )}
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Job Description</h3>
              <button
                onClick={() => setJobDescription('')}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Clear job description"
              >
                Clear
              </button>
            </div>
            
            <textarea
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 min-h-[250px] resize-y focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              aria-label="Job description input"
            />
            
            {jobDescription && isClient && (
              <div className="text-xs text-gray-500">
                {extractSkills(jobDescription).length} requirements detected
              </div>
            )}
          </div>
        </div>

        {/* Settings & Actions - Optimized */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" htmlFor="jobTitle">
                Job Title
              </label>
              <input
                id="jobTitle"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Developer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" htmlFor="experienceLevel">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior (5-8 years)</option>
                <option value="lead">Lead/Manager (8+ years)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" htmlFor="industry">
                Industry
              </label>
              <select
                id="industry"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={analyzeSkillsGap}
                disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
                className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Analyze Gap</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <button
            onClick={loadSampleData}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl px-4 py-2 text-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Load Sample Data</span>
          </button>
        </div>

        {/* Results Section - Lazy loaded */}
        {analysisResult && (
          <div ref={resultsRef} className="space-y-6">
            <Suspense fallback={<ResultsSkeleton />}>
              <ResultsSection
                result={analysisResult}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredGaps={filteredGaps}
                stats={stats}
                getStatusColor={getStatusColor}
                getImportanceBadge={getImportanceBadge}
                getMatchColor={getMatchColor}
              />
            </Suspense>
          </div>
        )}

        {/* CTA Section - Static content */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-600/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Close Your Skills Gap?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              Get the complete ATS Resume Kit with professional templates, keyword optimization guides, 
              and AI-powered prompts. Plus, book a 1-on-1 mentorship session for personalized career advice.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="ats-resume-checker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                <span>Get ATS Kit </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <Link
                href="/career/mentorship/one-on-one"
                className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                <span>Book Resume Session</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
              
              <Link
                href="/career/mentorship/resume-review"
                className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                <span>Resume Review</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions moved outside component for better performance
function getStatusColor(status: string): string {
  switch (status) {
    case 'matched': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'partial': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'missing': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'bonus': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
}

function getImportanceBadge(importance: string): string {
  switch (importance) {
    case 'critical': return 'bg-red-500/20 text-red-300';
    case 'important': return 'bg-yellow-500/20 text-yellow-300';
    case 'nice-to-have': return 'bg-blue-500/20 text-blue-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
}

function getMatchColor(percentage: number): string {
  if (percentage >= 80) return 'from-green-500 to-emerald-500';
  if (percentage >= 60) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-pink-500';
}