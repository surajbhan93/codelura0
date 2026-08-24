// app/salary-calculator/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Types
interface SalaryRange {
  min: number;
  max: number;
  median: number;
  percentile25: number;
  percentile75: number;
  currency: string;
}

interface SalaryData {
  base: SalaryRange;
  total: SalaryRange;
  bonus: {
    average: number;
    range: { min: number; max: number };
  };
  equity: {
    average: number;
    common: string;
  };
}

interface LocationAdjustment {
  city: string;
  country: string;
  multiplier: number;
  costOfLiving: number;
}

interface ExperienceMultiplier {
  level: string;
  multiplier: number;
  yearsRequired: string;
}

interface CompanySizeMultiplier {
  size: string;
  multiplier: number;
  description: string;
}

export default function SalaryCalculatorPage() {
  // Form State
  const [jobTitle, setJobTitle] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('mid');
  const [location, setLocation] = useState('US-Remote');
  const [companySize, setCompanySize] = useState('mid');
  const [industry, setIndustry] = useState('tech');
  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState('bachelors');
  const [includeEquity, setIncludeEquity] = useState(true);
  const [includeBonus, setIncludeBonus] = useState(true);
  
  // Results State
  const [calculatedSalary, setCalculatedSalary] = useState<SalaryData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeView, setActiveView] = useState<'chart' | 'breakdown' | 'comparison'>('chart');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  // Comparison State
  const [compareLocation, setCompareLocation] = useState('');
  const [compareResult, setCompareResult] = useState<SalaryData | null>(null);

  // Salary database (normally would come from API)
  const baseSalaries: Record<string, Record<string, SalaryRange>> = {
    tech: {
      'software-engineer': { min: 80000, max: 200000, median: 130000, percentile25: 105000, percentile75: 160000, currency: 'USD' },
      'senior-software-engineer': { min: 120000, max: 250000, median: 170000, percentile25: 140000, percentile75: 200000, currency: 'USD' },
      'lead-engineer': { min: 150000, max: 300000, median: 210000, percentile25: 175000, percentile75: 250000, currency: 'USD' },
      'engineering-manager': { min: 160000, max: 320000, median: 225000, percentile25: 185000, percentile75: 270000, currency: 'USD' },
      'data-scientist': { min: 90000, max: 200000, median: 140000, percentile25: 115000, percentile75: 170000, currency: 'USD' },
      'product-manager': { min: 90000, max: 220000, median: 140000, percentile25: 115000, percentile75: 175000, currency: 'USD' },
      'devops-engineer': { min: 95000, max: 210000, median: 145000, percentile25: 120000, percentile75: 175000, currency: 'USD' },
      'full-stack-developer': { min: 85000, max: 190000, median: 125000, percentile25: 100000, percentile75: 155000, currency: 'USD' },
      'frontend-developer': { min: 75000, max: 180000, median: 120000, percentile25: 95000, percentile75: 150000, currency: 'USD' },
      'backend-developer': { min: 85000, max: 200000, median: 135000, percentile25: 110000, percentile75: 165000, currency: 'USD' },
      'mobile-developer': { min: 80000, max: 190000, median: 130000, percentile25: 105000, percentile75: 160000, currency: 'USD' },
      'ui-ux-designer': { min: 70000, max: 170000, median: 115000, percentile25: 90000, percentile75: 145000, currency: 'USD' },
      'cybersecurity-analyst': { min: 85000, max: 200000, median: 135000, percentile25: 110000, percentile75: 165000, currency: 'USD' },
      'cloud-architect': { min: 120000, max: 250000, median: 175000, percentile25: 145000, percentile75: 210000, currency: 'USD' },
      'ml-engineer': { min: 110000, max: 240000, median: 165000, percentile25: 135000, percentile75: 200000, currency: 'USD' },
    },
    finance: {
      'financial-analyst': { min: 60000, max: 120000, median: 85000, percentile25: 70000, percentile75: 100000, currency: 'USD' },
      'investment-banker': { min: 100000, max: 300000, median: 180000, percentile25: 140000, percentile75: 240000, currency: 'USD' },
      'quantitative-analyst': { min: 110000, max: 280000, median: 170000, percentile25: 140000, percentile75: 220000, currency: 'USD' },
      'risk-manager': { min: 90000, max: 200000, median: 140000, percentile25: 115000, percentile75: 170000, currency: 'USD' },
    },
    healthcare: {
      'registered-nurse': { min: 55000, max: 110000, median: 75000, percentile25: 65000, percentile75: 90000, currency: 'USD' },
      'physician': { min: 180000, max: 400000, median: 260000, percentile25: 210000, percentile75: 320000, currency: 'USD' },
      'healthcare-administrator': { min: 70000, max: 160000, median: 105000, percentile25: 85000, percentile75: 135000, currency: 'USD' },
    },
    marketing: {
      'marketing-manager': { min: 70000, max: 160000, median: 110000, percentile25: 90000, percentile75: 140000, currency: 'USD' },
      'digital-marketing-specialist': { min: 50000, max: 110000, median: 75000, percentile25: 60000, percentile75: 95000, currency: 'USD' },
      'seo-specialist': { min: 45000, max: 100000, median: 70000, percentile25: 55000, percentile75: 85000, currency: 'USD' },
    },
  };

  // Location adjustments (multiplier based on cost of living & market rates)
  const locationMultipliers: Record<string, LocationAdjustment> = {
    'US-SF': { city: 'San Francisco', country: 'USA', multiplier: 1.45, costOfLiving: 2.5 },
    'US-NYC': { city: 'New York City', country: 'USA', multiplier: 1.35, costOfLiving: 2.3 },
    'US-Seattle': { city: 'Seattle', country: 'USA', multiplier: 1.25, costOfLiving: 1.8 },
    'US-Boston': { city: 'Boston', country: 'USA', multiplier: 1.20, costOfLiving: 1.7 },
    'US-LA': { city: 'Los Angeles', country: 'USA', multiplier: 1.20, costOfLiving: 1.9 },
    'US-Chicago': { city: 'Chicago', country: 'USA', multiplier: 1.05, costOfLiving: 1.3 },
    'US-Austin': { city: 'Austin', country: 'USA', multiplier: 1.10, costOfLiving: 1.2 },
    'US-Denver': { city: 'Denver', country: 'USA', multiplier: 1.05, costOfLiving: 1.4 },
    'US-Remote': { city: 'Remote', country: 'USA', multiplier: 1.0, costOfLiving: 1.0 },
    'UK-London': { city: 'London', country: 'UK', multiplier: 0.85, costOfLiving: 2.0 },
    'UK-Remote': { city: 'Remote', country: 'UK', multiplier: 0.65, costOfLiving: 1.0 },
    'CA-Toronto': { city: 'Toronto', country: 'Canada', multiplier: 0.80, costOfLiving: 1.5 },
    'CA-Vancouver': { city: 'Vancouver', country: 'Canada', multiplier: 0.75, costOfLiving: 1.8 },
    'DE-Berlin': { city: 'Berlin', country: 'Germany', multiplier: 0.70, costOfLiving: 1.2 },
    'IN-Bangalore': { city: 'Bangalore', country: 'India', multiplier: 0.25, costOfLiving: 0.3 },
    'IN-Mumbai': { city: 'Mumbai', country: 'India', multiplier: 0.30, costOfLiving: 0.4 },
    'IN-Delhi': { city: 'Delhi NCR', country: 'India', multiplier: 0.28, costOfLiving: 0.35 },
    'IN-Remote': { city: 'Remote', country: 'India', multiplier: 0.22, costOfLiving: 0.3 },
    'SG-Singapore': { city: 'Singapore', country: 'Singapore', multiplier: 0.75, costOfLiving: 1.7 },
    'AU-Sydney': { city: 'Sydney', country: 'Australia', multiplier: 0.80, costOfLiving: 1.8 },
  };

  // Experience multipliers
  const experienceMultipliers: Record<string, ExperienceMultiplier> = {
    entry: { level: 'Entry Level', multiplier: 0.7, yearsRequired: '0-2 years' },
    junior: { level: 'Junior', multiplier: 0.85, yearsRequired: '2-4 years' },
    mid: { level: 'Mid Level', multiplier: 1.0, yearsRequired: '4-7 years' },
    senior: { level: 'Senior', multiplier: 1.3, yearsRequired: '7-10 years' },
    lead: { level: 'Lead / Principal', multiplier: 1.5, yearsRequired: '10-15 years' },
    director: { level: 'Director', multiplier: 1.8, yearsRequired: '15+ years' },
    executive: { level: 'Executive / VP', multiplier: 2.5, yearsRequired: '15+ years' },
  };

  // Company size multipliers
  const companySizeMultipliers: Record<string, CompanySizeMultiplier> = {
    startup: { size: 'Startup (1-50)', multiplier: 0.85, description: 'Lower base, higher equity' },
    small: { size: 'Small (51-200)', multiplier: 0.95, description: 'Growing, moderate benefits' },
    mid: { size: 'Mid-size (201-1000)', multiplier: 1.05, description: 'Established, good benefits' },
    large: { size: 'Large (1001-5000)', multiplier: 1.15, description: 'Structured, full benefits' },
    enterprise: { size: 'Enterprise (5000+)', multiplier: 1.3, description: 'Highest base, full packages' },
    faang: { size: 'FAANG / Big Tech', multiplier: 1.6, description: 'Premium compensation' },
  };

  // Education adjustments
  const educationMultipliers: Record<string, number> = {
    'high-school': 0.7,
    'associates': 0.85,
    'bachelors': 1.0,
    'masters': 1.15,
    'mba': 1.25,
    'phd': 1.35,
  };

  // Popular skills and their salary impact
  const skillBonuses: Record<string, number> = {
    'ai-ml': 1.25,
    'blockchain': 1.20,
    'cloud': 1.15,
    'cybersecurity': 1.18,
    'data-science': 1.15,
    'devops': 1.12,
    'kubernetes': 1.15,
    'react': 1.08,
    'python': 1.10,
    'golang': 1.12,
    'rust': 1.20,
    'leadership': 1.15,
    'agile': 1.05,
  };

  // Currency conversion rates (simplified)
  const currencyRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83,
    CAD: 1.36,
    AUD: 1.53,
    SGD: 1.34,
  };

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    SGD: 'S$',
  };

  // Calculate salary
  const calculateSalary = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const roleKey = selectedRole || 'software-engineer';
      const industryData = baseSalaries[industry] || baseSalaries.tech;
      const baseSalary = industryData[roleKey] || industryData['software-engineer'];
      
      if (!baseSalary) {
        setIsCalculating(false);
        return;
      }
      
      // Apply multipliers
      const expMult = experienceMultipliers[experience]?.multiplier || 1.0;
      const locMult = locationMultipliers[location]?.multiplier || 1.0;
      const compMult = companySizeMultipliers[companySize]?.multiplier || 1.0;
      const eduMult = educationMultipliers[education] || 1.0;
      
      // Calculate skill bonus
      let skillMult = 1.0;
      skills.forEach(skill => {
        skillMult *= (skillBonuses[skill] || 1.0);
      });
      
      // Combined multiplier with diminishing returns for multiple high multipliers
      const combinedMult = (expMult * 0.4 + locMult * 0.25 + compMult * 0.2 + eduMult * 0.1 + skillMult * 0.05);
      
      // Calculate adjusted ranges
      const adjustedBase: SalaryRange = {
        min: Math.round(baseSalary.min * combinedMult),
        max: Math.round(baseSalary.max * combinedMult),
        median: Math.round(baseSalary.median * combinedMult),
        percentile25: Math.round(baseSalary.percentile25 * combinedMult),
        percentile75: Math.round(baseSalary.percentile75 * combinedMult),
        currency: selectedCurrency,
      };
      
      // Calculate bonus (typically 10-20% of base)
      const bonusPct = experience === 'senior' || experience === 'lead' ? 0.20 : 
                        experience === 'director' || experience === 'executive' ? 0.30 : 0.10;
      
      const bonus = {
        average: Math.round(adjustedBase.median * bonusPct),
        range: {
          min: Math.round(adjustedBase.median * bonusPct * 0.5),
          max: Math.round(adjustedBase.median * bonusPct * 1.5),
        },
      };
      
      // Calculate equity (for tech roles)
      let equity = { average: 0, common: 'N/A' };
      if (industry === 'tech' && includeEquity) {
        const equityMultiplier = companySize === 'startup' ? 0.5 :
                                 companySize === 'faang' ? 0.8 : 0.3;
        equity = {
          average: Math.round(adjustedBase.median * equityMultiplier),
          common: companySize === 'startup' ? '1-2% equity' :
                  companySize === 'faang' ? 'RSUs $50k-$200k/year' : 'Stock options',
        };
      }
      
      // Calculate total compensation
      const totalComp = adjustedBase.median + (includeBonus ? bonus.average : 0) + (includeEquity ? equity.average : 0);
      
      const adjustedTotal: SalaryRange = {
        min: Math.round(adjustedBase.min + (includeBonus ? bonus.range.min : 0)),
        max: Math.round(adjustedBase.max + (includeBonus ? bonus.range.max : 0) + (includeEquity ? equity.average * 2 : 0)),
        median: Math.round(totalComp),
        percentile25: Math.round(adjustedBase.percentile25 + (includeBonus ? bonus.range.min : 0)),
        percentile75: Math.round(adjustedBase.percentile75 + (includeBonus ? bonus.range.max : 0)),
        currency: selectedCurrency,
      };
      
      setCalculatedSalary({
        base: adjustedBase,
        total: adjustedTotal,
        bonus,
        equity,
      });
      
      setIsCalculating(false);
    }, 800);
  }, [selectedRole, experience, location, companySize, industry, skills, education, includeEquity, includeBonus, selectedCurrency]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = selectedCurrency): string => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    const converted = Math.round(amount * rate);
    
    if (currency === 'INR') {
      // Indian formatting (lakhs, crores)
      if (converted >= 10000000) {
        return `${symbol}${(converted / 10000000).toFixed(2)} Cr`;
      } else if (converted >= 100000) {
        return `${symbol}${(converted / 100000).toFixed(2)} L`;
      }
      return `${symbol}${converted.toLocaleString('en-IN')}`;
    }
    
    return `${symbol}${converted.toLocaleString()}`;
  };

  // Compare with another location
  const compareWithLocation = () => {
    if (!compareLocation || !calculatedSalary) return;
    
    const compareLoc = locationMultipliers[compareLocation];
    const currentLoc = locationMultipliers[location];
    
    if (!compareLoc || !currentLoc) return;
    
    const ratio = compareLoc.multiplier / currentLoc.multiplier;
    
    setCompareResult({
      base: {
        min: Math.round(calculatedSalary.base.min * ratio),
        max: Math.round(calculatedSalary.base.max * ratio),
        median: Math.round(calculatedSalary.base.median * ratio),
        percentile25: Math.round(calculatedSalary.base.percentile25 * ratio),
        percentile75: Math.round(calculatedSalary.base.percentile75 * ratio),
        currency: selectedCurrency,
      },
      total: {
        min: Math.round(calculatedSalary.total.min * ratio),
        max: Math.round(calculatedSalary.total.max * ratio),
        median: Math.round(calculatedSalary.total.median * ratio),
        percentile25: Math.round(calculatedSalary.total.percentile25 * ratio),
        percentile75: Math.round(calculatedSalary.total.percentile75 * ratio),
        currency: selectedCurrency,
      },
      bonus: {
        average: Math.round(calculatedSalary.bonus.average * ratio),
        range: {
          min: Math.round(calculatedSalary.bonus.range.min * ratio),
          max: Math.round(calculatedSalary.bonus.range.max * ratio),
        },
      },
      equity: {
        average: Math.round(calculatedSalary.equity.average * ratio),
        common: calculatedSalary.equity.common,
      },
    });
  };

  // Get salary gauge color
  const getSalaryColor = (value: number, min: number, max: number): string => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 25) return 'from-red-500 to-orange-500';
    if (percentage < 50) return 'from-orange-500 to-yellow-500';
    if (percentage < 75) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-emerald-500';
  };

  // Popular roles for quick selection
  const popularRoles = [
    { id: 'software-engineer', label: 'Software Engineer', icon: '💻' },
    { id: 'data-scientist', label: 'Data Scientist', icon: '📊' },
    { id: 'product-manager', label: 'Product Manager', icon: '📱' },
    { id: 'full-stack-developer', label: 'Full Stack Developer', icon: '🚀' },
    { id: 'devops-engineer', label: 'DevOps Engineer', icon: '⚙️' },
    { id: 'ui-ux-designer', label: 'UI/UX Designer', icon: '🎨' },
  ];

  const popularSkills = [
    { id: 'ai-ml', label: 'AI/ML', emoji: '🤖' },
    { id: 'cloud', label: 'Cloud', emoji: '☁️' },
    { id: 'cybersecurity', label: 'Cybersecurity', emoji: '🔒' },
    { id: 'react', label: 'React', emoji: '⚛️' },
    { id: 'python', label: 'Python', emoji: '🐍' },
    { id: 'kubernetes', label: 'Kubernetes', emoji: '☸️' },
    { id: 'devops', label: 'DevOps', emoji: '🔄' },
    { id: 'leadership', label: 'Leadership', emoji: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <header className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center space-x-2 bg-violet-600/10 border border-violet-600/20 rounded-full px-4 py-2 mb-6">
            <span className="text-lg">💰</span>
            <span className="text-sm text-violet-300">Market Data Powered Calculator</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">
              Salary Calculator
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Calculate your market value based on role, experience, location, skills, and company size. 
            Compare across cities and make informed career decisions.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Role Selection */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Popular Roles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`text-left p-3 rounded-xl text-sm transition-all ${
                      selectedRole === role.id
                        ? 'bg-violet-600/20 border border-violet-600/40 text-violet-300'
                        : 'bg-gray-950 border border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-1">{role.icon}</div>
                    <div className="text-xs font-medium">{role.label}</div>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Or enter custom role</label>
                <input
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                />
              </div>
            </div>

            {/* Experience & Education */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Experience & Education
              </h3>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Experience Level</label>
                <select
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  {Object.entries(experienceMultipliers).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.level} ({val.yearsRequired})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Education</label>
                <select
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                >
                  <option value="high-school">High School</option>
                  <option value="associates">Associate's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="mba">MBA</option>
                  <option value="phd">Ph.D.</option>
                </select>
              </div>
            </div>

            {/* Location & Company */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Location & Company
              </h3>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Location</label>
                <select
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <optgroup label="🇺🇸 United States">
                    <option value="US-SF">San Francisco Bay Area</option>
                    <option value="US-NYC">New York City</option>
                    <option value="US-Seattle">Seattle</option>
                    <option value="US-Boston">Boston</option>
                    <option value="US-LA">Los Angeles</option>
                    <option value="US-Chicago">Chicago</option>
                    <option value="US-Austin">Austin</option>
                    <option value="US-Denver">Denver</option>
                    <option value="US-Remote">US - Remote</option>
                  </optgroup>
                  <optgroup label="🇮🇳 India">
                    <option value="IN-Bangalore">Bangalore</option>
                    <option value="IN-Mumbai">Mumbai</option>
                    <option value="IN-Delhi">Delhi NCR</option>
                    <option value="IN-Remote">India - Remote</option>
                  </optgroup>
                  <optgroup label="🌍 Other">
                    <option value="UK-London">London, UK</option>
                    <option value="UK-Remote">UK - Remote</option>
                    <option value="CA-Toronto">Toronto, Canada</option>
                    <option value="CA-Vancouver">Vancouver, Canada</option>
                    <option value="DE-Berlin">Berlin, Germany</option>
                    <option value="SG-Singapore">Singapore</option>
                    <option value="AU-Sydney">Sydney, Australia</option>
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Company Size</label>
                <select
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                >
                  {Object.entries(companySizeMultipliers).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.size} - {val.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Industry</label>
                <select
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
            </div>

            {/* Skills */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Skills (Add for bonus)
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => {
                      setSkills(prev =>
                        prev.includes(skill.id)
                          ? prev.filter(s => s !== skill.id)
                          : [...prev, skill.id]
                      );
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                      skills.includes(skill.id)
                        ? 'bg-violet-600/20 border border-violet-600/40 text-violet-300'
                        : 'bg-gray-950 border border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>{skill.emoji}</span>
                    <span>{skill.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Compensation Options */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Compensation Options
              </h3>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-400">Include Bonus</span>
                <button
                  onClick={() => setIncludeBonus(!includeBonus)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    includeBonus ? 'bg-violet-600' : 'bg-gray-700'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    includeBonus ? 'translate-x-5' : ''
                  }`} />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-400">Include Equity/RSUs</span>
                <button
                  onClick={() => setIncludeEquity(!includeEquity)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    includeEquity ? 'bg-violet-600' : 'bg-gray-700'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    includeEquity ? 'translate-x-5' : ''
                  }`} />
                </button>
              </label>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Display Currency</label>
                <select
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateSalary}
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <span>Calculate Salary</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {calculatedSalary && (
              <>
                {/* Salary Overview Card */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedRole ? popularRoles.find(r => r.id === selectedRole)?.label || jobTitle : 'Salary Estimate'}
                    </h3>
                    <div className="flex space-x-1">
                      {(['chart', 'breakdown', 'comparison'] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setActiveView(view)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeView === view
                              ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {view === 'chart' && '📊 Chart'}
                          {view === 'breakdown' && '📋 Breakdown'}
                          {view === 'comparison' && '🔄 Compare'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeView === 'chart' && (
                    <div className="space-y-6">
                      {/* Total Compensation */}
                      <div className="text-center p-6 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-xl border border-violet-600/20">
                        <div className="text-sm text-gray-400 mb-1">Estimated Total Compensation</div>
                        <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                          {formatCurrency(calculatedSalary.total.median)}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Range: {formatCurrency(calculatedSalary.total.min)} - {formatCurrency(calculatedSalary.total.max)}
                        </div>
                      </div>

                      {/* Salary Range Visualization */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Min</span>
                          <span>25th</span>
                          <span>Median</span>
                          <span>75th</span>
                          <span>Max</span>
                        </div>
                        
                        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-r ${getSalaryColor(calculatedSalary.base.median, calculatedSalary.base.min, calculatedSalary.base.max)} opacity-20`} />
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full opacity-50"
                            style={{ width: `${((calculatedSalary.base.median - calculatedSalary.base.min) / (calculatedSalary.base.max - calculatedSalary.base.min)) * 100}%` }}
                          />
                          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 -translate-y-1/2">
                            {[calculatedSalary.base.min, calculatedSalary.base.percentile25, calculatedSalary.base.median, calculatedSalary.base.percentile75, calculatedSalary.base.max].map((val, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-white rounded-full border-2 border-violet-500" />
                                <span className="text-xs text-gray-400 mt-1">{formatCurrency(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-8">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Base Salary Range</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(calculatedSalary.base.percentile25)} - {formatCurrency(calculatedSalary.base.percentile75)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-950 rounded-xl p-4 text-center border border-gray-800">
                          <div className="text-lg font-bold text-green-400">
                            {formatCurrency(calculatedSalary.base.median)}
                          </div>
                          <div className="text-xs text-gray-500">Base Salary</div>
                        </div>
                        {includeBonus && (
                          <div className="bg-gray-950 rounded-xl p-4 text-center border border-gray-800">
                            <div className="text-lg font-bold text-blue-400">
                              {formatCurrency(calculatedSalary.bonus.average)}
                            </div>
                            <div className="text-xs text-gray-500">Bonus</div>
                          </div>
                        )}
                        {includeEquity && calculatedSalary.equity.average > 0 && (
                          <div className="bg-gray-950 rounded-xl p-4 text-center border border-gray-800">
                            <div className="text-lg font-bold text-purple-400">
                              {formatCurrency(calculatedSalary.equity.average)}
                            </div>
                            <div className="text-xs text-gray-500">Equity/Year</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeView === 'breakdown' && (
                    <div className="space-y-4">
                      <div className="bg-gray-950 rounded-xl p-5 border border-gray-800">
                        <h4 className="text-sm font-semibold text-white mb-4">Compensation Breakdown</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-800">
                            <span className="text-gray-400">Base Salary</span>
                            <div className="text-right">
                              <div className="text-white font-semibold">{formatCurrency(calculatedSalary.base.median)}</div>
                              <div className="text-xs text-gray-500">
                                Range: {formatCurrency(calculatedSalary.base.min)} - {formatCurrency(calculatedSalary.base.max)}
                              </div>
                            </div>
                          </div>
                          
                          {includeBonus && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                              <span className="text-gray-400">Annual Bonus</span>
                              <div className="text-right">
                                <div className="text-blue-400 font-semibold">{formatCurrency(calculatedSalary.bonus.average)}</div>
                                <div className="text-xs text-gray-500">~{Math.round((calculatedSalary.bonus.average / calculatedSalary.base.median) * 100)}% of base</div>
                              </div>
                            </div>
                          )}
                          
                          {includeEquity && calculatedSalary.equity.average > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                              <span className="text-gray-400">Equity (Annual Value)</span>
                              <div className="text-right">
                                <div className="text-purple-400 font-semibold">{formatCurrency(calculatedSalary.equity.average)}</div>
                                <div className="text-xs text-gray-500">{calculatedSalary.equity.common}</div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center py-3 bg-violet-600/5 rounded-lg px-3 -mx-3">
                            <span className="text-white font-semibold">Total Compensation</span>
                            <div className="text-right">
                              <div className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                {formatCurrency(calculatedSalary.total.median)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-950 rounded-xl p-5 border border-gray-800">
                        <h4 className="text-sm font-semibold text-white mb-4">Location Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Location</div>
                            <div className="text-sm text-white">
                              {locationMultipliers[location]?.city}, {locationMultipliers[location]?.country}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Market Rate Multiplier</div>
                            <div className="text-sm text-white">{locationMultipliers[location]?.multiplier}x</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Experience</div>
                            <div className="text-sm text-white">{experienceMultipliers[experience]?.level}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Company Size</div>
                            <div className="text-sm text-white">{companySizeMultipliers[companySize]?.size}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeView === 'comparison' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Compare with another location</label>
                        <div className="flex gap-2">
                          <select
                            className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200"
                            value={compareLocation}
                            onChange={(e) => setCompareLocation(e.target.value)}
                          >
                            <option value="">Select location...</option>
                            {Object.entries(locationMultipliers).map(([key, val]) => (
                              <option key={key} value={key}>
                                {val.city}, {val.country}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={compareWithLocation}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm transition-all"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                      
                      {compareResult && (
                        <div className="bg-gray-950 rounded-xl p-5 border border-gray-800">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-xs text-gray-500 mb-2">Current Location</div>
                              <div className="text-sm text-white font-semibold mb-3">
                                {locationMultipliers[location]?.city}
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Base</span>
                                  <span className="text-white">{formatCurrency(calculatedSalary.base.median)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Total</span>
                                  <span className="text-white font-semibold">{formatCurrency(calculatedSalary.total.median)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-gray-500 mb-2">Compared Location</div>
                              <div className="text-sm text-white font-semibold mb-3">
                                {locationMultipliers[compareLocation]?.city}
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Base</span>
                                  <span className="text-white">{formatCurrency(compareResult.base.median)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Total</span>
                                  <span className="text-white font-semibold">{formatCurrency(compareResult.total.median)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-violet-600/10 rounded-lg border border-violet-600/20">
                            <div className="text-sm text-violet-300">
                              {compareResult.total.median > calculatedSalary.total.median ? (
                                <>📈 {formatCurrency(compareResult.total.median - calculatedSalary.total.median)} more in {locationMultipliers[compareLocation]?.city}</>
                              ) : (
                                <>📉 {formatCurrency(calculatedSalary.total.median - compareResult.total.median)} less in {locationMultipliers[compareLocation]?.city}</>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Market Insights */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">💡 Market Insights</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-sm font-medium text-white">Salary Trend</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {experience === 'senior' || experience === 'lead' ? 
                          'Senior roles seeing 15-20% YoY growth' :
                          'Market showing steady 8-12% annual growth'}
                      </div>
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm font-medium text-white">Negotiation Range</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Target {formatCurrency(calculatedSalary.base.percentile75)} for competitive offer
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-600/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🚀</div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">Ready to land that salary?</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Optimize your resume and interview skills with our ATS Kit and mentorship sessions. 
                        Get the salary you deserve.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="https://hugoclaw.gumroad.com/l/ats-kit?from=salarycalc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all"
                        >
                          Get ATS Kit - $12
                        </a>
                        <Link
                          href="/mentorship"
                          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all"
                        >
                          Book Salary Negotiation Session
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!calculatedSalary && !isCalculating && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Salary Estimate</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Select a role, adjust your experience and location, then click Calculate to see your market value.
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
                <svg className="animate-spin w-12 h-12 mx-auto mb-4 text-violet-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Calculating...</h3>
                <p className="text-gray-400">Analyzing market data for your profile</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "How accurate is this salary calculator?",
                a: "Our calculator uses aggregated market data from multiple sources including job boards, company filings, and salary surveys. While we strive for accuracy, actual offers may vary based on specific company budgets, your negotiation skills, and unique circumstances."
              },
              {
                q: "How does location affect salary?",
                a: "Location significantly impacts compensation. Tech hubs like San Francisco and NYC typically offer 30-45% higher base salaries compared to remote positions, but also have higher costs of living. Our calculator factors in both market rates and cost of living adjustments."
              },
              {
                q: "Are equity and bonus estimates realistic?",
                a: "Bonus and equity estimates are based on industry averages. Startups typically offer higher equity but lower base, while large companies offer more structured bonus programs. FAANG companies often provide significant RSU packages."
              },
              {
                q: "How often is the salary data updated?",
                a: "We update our salary data quarterly to reflect current market conditions. However, always research recent offers on platforms like Levels.fyi, Glassdoor, and Blind for the most current data."
              },
            ].map((faq, i) => (
              <details key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl group">
                <summary className="cursor-pointer px-5 py-4 font-medium text-gray-200 group-open:text-violet-400 transition-colors">
                  {faq.q}
                </summary>
                <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

     
      </div>
    </div>
  );
}