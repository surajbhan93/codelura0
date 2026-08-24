// app/resume-builder/page.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  title: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  location: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'custom';
  title: string;
  enabled: boolean;
  order: number;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: { id: string; title: string; content: string }[];
}

type TemplateType = 'modern' | 'classic' | 'minimal';
type FontFamily = 'inter' | 'roboto' | 'playfair' | 'mono' | 'calibri';
type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'teal' | 'orange' | 'gray' | 'black';

interface TemplateConfig {
  type: TemplateType;
  font: FontFamily;
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  showIcons: boolean;
  showBorders: boolean;
}

// Sortable Section Component
function SortableSection({ section, children }: { section: ResumeSection; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2 mb-2">
        <button {...listeners} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  type: 'modern',
  font: 'inter',
  colorScheme: 'blue',
  fontSize: 'medium',
  spacing: 'normal',
  showIcons: true,
  showBorders: true,
};

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'settings'>('edit');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(DEFAULT_TEMPLATE_CONFIG);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      title: '',
      summary: '',
    },
    sections: [
      { id: 'experience', type: 'experience', title: 'Work Experience', enabled: true, order: 0 },
      { id: 'education', type: 'education', title: 'Education', enabled: true, order: 1 },
      { id: 'skills', type: 'skills', title: 'Skills', enabled: true, order: 2 },
      { id: 'projects', type: 'projects', title: 'Projects', enabled: true, order: 3 },
      { id: 'certifications', type: 'certifications', title: 'Certifications', enabled: false, order: 4 },
      { id: 'languages', type: 'languages', title: 'Languages', enabled: false, order: 5 },
    ],
    experiences: [
      { id: 'exp1', company: '', position: '', startDate: '', endDate: '', current: false, description: '', achievements: [''], location: '' },
    ],
    education: [
      { id: 'edu1', school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', achievements: [''] },
    ],
    skills: [
      { id: 'skill1', name: '', level: 3, category: 'Technical' },
    ],
    projects: [
      { id: 'proj1', name: '', description: '', technologies: [''], link: '', startDate: '', endDate: '' },
    ],
    certifications: [],
    languages: [],
    customSections: [],
  });

  const [undoStack, setUndoStack] = useState<ResumeData[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeData[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load template configuration from sessionStorage
  useEffect(() => {
    const savedTemplate = sessionStorage.getItem('selectedTemplate');
    
    if (savedTemplate) {
      try {
        const templateConfigData = JSON.parse(savedTemplate);
        
        if (templateConfigData.type || templateConfigData.font || templateConfigData.colorScheme) {
          setTemplateConfig({
            type: templateConfigData.type || 'modern',
            font: templateConfigData.font || 'inter',
            colorScheme: templateConfigData.colorScheme || 'blue',
            fontSize: templateConfigData.fontSize || 'medium',
            spacing: templateConfigData.spacing || 'normal',
            showIcons: templateConfigData.showIcons ?? true,
            showBorders: templateConfigData.showBorders ?? true,
          });
        }

        if (templateConfigData.sections) {
          setResumeData(prev => ({
            ...prev,
            sections: prev.sections.map(section => ({
              ...section,
              enabled: templateConfigData.sections?.[section.type] ?? section.enabled,
            })),
          }));
        }
        
        sessionStorage.removeItem('selectedTemplate');
        sessionStorage.removeItem('templateName');
      } catch (e) {
        console.error('Failed to load template config:', e);
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));
      setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timer);
  }, [resumeData]);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('resume-builder-data');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const pushToUndo = useCallback(() => {
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(resumeData))]);
    setRedoStack([]);
  }, [resumeData]);

  const undo = () => {
    if (undoStack.length > 0) {
      const previous = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(resumeData))]);
      setResumeData(previous);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(resumeData))]);
      setResumeData(next);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  // Personal Info Handlers
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    pushToUndo();
    const newExp: Experience = {
      id: `exp${Date.now()}`,
      company: '', position: '', startDate: '', endDate: '', current: false,
      description: '', achievements: [''], location: '',
    };
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  };

  const addAchievement = (expId: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
      ),
    }));
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          const newAchievements = [...exp.achievements];
          newAchievements[index] = value;
          return { ...exp, achievements: newAchievements };
        }
        return exp;
      }),
    }));
  };

  const removeAchievement = (expId: string, index: number) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          return { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) };
        }
        return exp;
      }),
    }));
  };

  // Education Handlers
  const addEducation = () => {
    pushToUndo();
    const newEdu: Education = {
      id: `edu${Date.now()}`,
      school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', achievements: [''],
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  // Skill Handlers
  const addSkill = () => {
    pushToUndo();
    const newSkill: Skill = {
      id: `skill${Date.now()}`,
      name: '', level: 3, category: 'Technical',
    };
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  // Project Handlers
  const addProject = () => {
    pushToUndo();
    const newProj: Project = {
      id: `proj${Date.now()}`,
      name: '', description: '', technologies: [], link: '', startDate: '', endDate: '',
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  };

  // Certification Handlers
  const addCertification = () => {
    pushToUndo();
    const newCert: Certification = {
      id: `cert${Date.now()}`,
      name: '', issuer: '', date: '', link: '',
    };
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const removeCertification = (id: string) => {
    pushToUndo();
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }));
  };

  // Drag and Drop Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setResumeData(prev => {
        const oldIndex = prev.sections.findIndex(s => s.id === active.id);
        const newIndex = prev.sections.findIndex(s => s.id === over.id);
        const newSections = arrayMove(prev.sections, oldIndex, newIndex);
        return { ...prev, sections: newSections.map((s, i) => ({ ...s, order: i })) };
      });
    }
  };

  // Color schemes
  const colorSchemes: Record<ColorScheme, { primary: string; secondary: string; accent: string; text: string; bg: string }> = {
    blue: { primary: '#2563eb', secondary: '#1e40af', accent: '#dbeafe', text: '#1e293b', bg: '#ffffff' },
    green: { primary: '#059669', secondary: '#047857', accent: '#d1fae5', text: '#1e293b', bg: '#ffffff' },
    purple: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#ede9fe', text: '#1e293b', bg: '#ffffff' },
    red: { primary: '#dc2626', secondary: '#991b1b', accent: '#fee2e2', text: '#1e293b', bg: '#ffffff' },
    teal: { primary: '#0d9488', secondary: '#0f766e', accent: '#ccfbf1', text: '#1e293b', bg: '#ffffff' },
    orange: { primary: '#ea580c', secondary: '#c2410c', accent: '#fff7ed', text: '#1e293b', bg: '#ffffff' },
    gray: { primary: '#4b5563', secondary: '#374151', accent: '#f3f4f6', text: '#1e293b', bg: '#ffffff' },
    black: { primary: '#18181b', secondary: '#000000', accent: '#e4e4e7', text: '#1e293b', bg: '#ffffff' },
  };

  const fontFamilies: Record<FontFamily, string> = {
    inter: 'Inter, sans-serif',
    roboto: 'Roboto, sans-serif',
    playfair: 'Playfair Display, serif',
    mono: 'JetBrains Mono, monospace',
    calibri: 'Calibri, sans-serif',
  };

  const fontSizeMap = { small: '12px', medium: '14px', large: '16px' };
  const spacingMap = { compact: '8px', normal: '16px', spacious: '24px' };

  // Export functions
  const exportToPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ format: 'a4', unit: 'px' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'resume'}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.personalInfo && data.sections) {
          setResumeData(data);
        }
      } catch (err) {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    pushToUndo();
    setResumeData({
      personalInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        website: 'alexjohnson.dev',
        title: 'Senior Software Engineer',
        summary: 'Experienced software engineer with 8+ years building scalable web applications.',
      },
      sections: [
        { id: 'experience', type: 'experience', title: 'Work Experience', enabled: true, order: 0 },
        { id: 'skills', type: 'skills', title: 'Technical Skills', enabled: true, order: 1 },
        { id: 'projects', type: 'projects', title: 'Projects', enabled: true, order: 2 },
        { id: 'education', type: 'education', title: 'Education', enabled: true, order: 3 },
        { id: 'certifications', type: 'certifications', title: 'Certifications', enabled: false, order: 4 },
        { id: 'languages', type: 'languages', title: 'Languages', enabled: false, order: 5 },
      ],
      experiences: [
        {
          id: 'exp1', company: 'TechCorp Inc.', position: 'Senior Software Engineer',
          startDate: '2021-03', endDate: '', current: true, location: 'San Francisco, CA',
          description: 'Lead engineer for core platform team.',
          achievements: [
            'Redesigned API gateway reducing latency by 40%',
            'Led migration from monolith to microservices',
            'Mentored 5 junior engineers',
          ],
        },
        {
          id: 'exp2', company: 'StartupXYZ', position: 'Software Engineer',
          startDate: '2018-06', endDate: '2021-02', current: false, location: 'Remote',
          description: 'Full-stack developer for SaaS platform.',
          achievements: [
            'Built real-time collaboration feature used by 50K+ users',
            'Implemented CI/CD pipeline reducing bug escape rate by 60%',
          ],
        },
      ],
      education: [
        {
          id: 'edu1', school: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science',
          startDate: '2014', endDate: '2018', gpa: '3.8', achievements: [],
        },
      ],
      skills: [
        { id: 'skill1', name: 'React/Next.js', level: 5, category: 'Frontend' },
        { id: 'skill2', name: 'TypeScript', level: 5, category: 'Languages' },
        { id: 'skill3', name: 'Node.js', level: 4, category: 'Backend' },
        { id: 'skill4', name: 'Python', level: 4, category: 'Languages' },
        { id: 'skill5', name: 'AWS', level: 4, category: 'Cloud' },
        { id: 'skill6', name: 'Docker/K8s', level: 3, category: 'DevOps' },
      ],
      projects: [
        {
          id: 'proj1', name: 'OpenSource Dashboard',
          description: 'Real-time analytics dashboard with customizable widgets.',
          technologies: ['React', 'D3.js', 'Node.js', 'WebSocket'],
          link: 'github.com/alex/dashboard', startDate: '2023-01', endDate: '2023-06',
        },
      ],
      certifications: [],
      languages: [],
      customSections: [],
    });
  };

  const colors = colorSchemes[templateConfig.colorScheme] ?? colorSchemes[DEFAULT_TEMPLATE_CONFIG.colorScheme];
  const font = fontFamilies[templateConfig.font] ?? fontFamilies[DEFAULT_TEMPLATE_CONFIG.font];
  const baseFontSize = fontSizeMap[templateConfig.fontSize];
  const baseSpacing = spacingMap[templateConfig.spacing];

  // Render Preview
  const renderPreview = () => {
    const { personalInfo, experiences, education, skills, projects, certifications, languages, sections } = resumeData;
    const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

    const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin || personalInfo.website;

    switch (templateConfig.type) {
      case 'modern':
        return (
          <div style={{ display: 'flex', fontFamily: font, fontSize: baseFontSize, lineHeight: '1.6', minHeight: '297mm', width: '210mm' }}>
            {/* Sidebar */}
            <div style={{ width: '35%', backgroundColor: colors.secondary, color: '#fff', padding: baseSpacing }}>
              {hasContact && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${colors.accent}40`, paddingBottom: '4px', marginBottom: '8px' }}>Contact</h3>
                  <div style={{ fontSize: '12px' }}>
                    {personalInfo.email && <div>📧 {personalInfo.email}</div>}
                    {personalInfo.phone && <div>📱 {personalInfo.phone}</div>}
                    {personalInfo.location && <div>📍 {personalInfo.location}</div>}
                    {personalInfo.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
                    {personalInfo.website && <div>🌐 {personalInfo.website}</div>}
                  </div>
                </div>
              )}

              {enabledSections.find(s => s.type === 'skills') && skills.length > 0 && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${colors.accent}40`, paddingBottom: '4px', marginBottom: '8px' }}>Skills</h3>
                  {skills.map(skill => (
                    <div key={skill.id} style={{ marginBottom: '6px' }}>
                      <div style={{ fontSize: '11px', marginBottom: '2px' }}>{skill.name}</div>
                      <div style={{ width: '100%', height: '4px', borderRadius: '2px', backgroundColor: `${colors.accent}40` }}>
                        <div style={{ width: `${(skill.level / 5) * 100}%`, height: '100%', borderRadius: '2px', backgroundColor: colors.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {enabledSections.find(s => s.type === 'education') && education.length > 0 && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${colors.accent}40`, paddingBottom: '4px', marginBottom: '8px' }}>Education</h3>
                  {education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                      <div style={{ opacity: 0.8 }}>{edu.school}</div>
                      <div style={{ opacity: 0.6, fontSize: '10px' }}>{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                    </div>
                  ))}
                </div>
              )}

              {enabledSections.find(s => s.type === 'languages') && languages.length > 0 && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${colors.accent}40`, paddingBottom: '4px', marginBottom: '8px' }}>Languages</h3>
                  {languages.map(lang => (
                    <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>{lang.name}</span>
                      <span style={{ opacity: 0.6 }}>{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}

              {enabledSections.find(s => s.type === 'certifications') && certifications.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${colors.accent}40`, paddingBottom: '4px', marginBottom: '8px' }}>Certifications</h3>
                  {certifications.map(cert => (
                    <div key={cert.id} style={{ marginBottom: '6px', fontSize: '11px' }}>
                      <div style={{ fontWeight: 600 }}>{cert.name}</div>
                      <div style={{ opacity: 0.6, fontSize: '10px' }}>{cert.issuer} • {cert.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, backgroundColor: colors.bg, color: colors.text, padding: baseSpacing }}>
              <div style={{ borderBottom: `3px solid ${colors.primary}`, paddingBottom: '12px', marginBottom: baseSpacing }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
                <div style={{ fontSize: '16px', color: colors.secondary }}>{personalInfo.title}</div>
              </div>

              {personalInfo.summary && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, marginBottom: '4px' }}>Professional Summary</h3>
                  <p style={{ fontSize: '13px', margin: 0 }}>{personalInfo.summary}</p>
                </div>
              )}

              {enabledSections.find(s => s.type === 'experience') && experiences.length > 0 && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, borderBottom: `1px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '8px' }}>Work Experience</h3>
                  {experiences.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{exp.position}</div>
                          <div style={{ fontSize: '13px', color: colors.secondary }}>{exp.company}{exp.location && ` • ${exp.location}`}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: colors.secondary }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      {exp.achievements.filter(a => a.trim()).length > 0 && (
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                          {exp.achievements.filter(a => a.trim()).map((ach, i) => (
                            <li key={i} style={{ fontSize: '12px', marginBottom: '2px' }}>
                              <span style={{ color: colors.primary }}>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {enabledSections.find(s => s.type === 'projects') && projects.length > 0 && (
                <div style={{ marginBottom: baseSpacing }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, borderBottom: `1px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '8px' }}>Projects</h3>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{proj.name}</span>
                        {proj.link && <a href={proj.link} style={{ fontSize: '11px', color: colors.primary }}>{proj.link}</a>}
                      </div>
                      <p style={{ fontSize: '12px', margin: '2px 0' }}>{proj.description}</p>
                      {proj.technologies.filter(t => t).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {proj.technologies.filter(t => t).map((tech, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: colors.accent, color: colors.primary }}>{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'classic':
        return (
          <div style={{ fontFamily: font, fontSize: baseFontSize, lineHeight: '1.6', padding: baseSpacing, backgroundColor: colors.bg, color: colors.text, minHeight: '297mm', width: '210mm' }}>
            <div style={{ textAlign: 'center', borderBottom: `2px solid ${colors.primary}`, paddingBottom: '16px', marginBottom: baseSpacing }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.primary, margin: '0 0 4px 0' }}>{personalInfo.fullName || 'Your Name'}</h1>
              <div style={{ fontSize: '16px', color: colors.secondary, marginBottom: '8px' }}>{personalInfo.title}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', flexWrap: 'wrap' }}>
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              </div>
            </div>

            {personalInfo.summary && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, marginBottom: '4px' }}>Professional Summary</h3>
                <p style={{ fontSize: '13px', margin: 0 }}>{personalInfo.summary}</p>
              </div>
            )}

            {enabledSections.find(s => s.type === 'experience') && experiences.length > 0 && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, borderBottom: `1px solid ${colors.primary}40`, paddingBottom: '4px', marginBottom: '8px' }}>Experience</h3>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{exp.position} - {exp.company}</span>
                      <span style={{ fontSize: '12px', color: colors.secondary }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    {exp.achievements.filter(a => a.trim()).length > 0 && (
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                        {exp.achievements.filter(a => a.trim()).map((ach, i) => (
                          <li key={i} style={{ fontSize: '12px' }}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {enabledSections.find(s => s.type === 'education') && education.length > 0 && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, borderBottom: `1px solid ${colors.primary}40`, paddingBottom: '4px', marginBottom: '8px' }}>Education</h3>
                {education.map(edu => (
                  <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{edu.school}</span>
                      <span style={{ fontSize: '12px' }}> - {edu.degree} {edu.field && `in ${edu.field}`}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: colors.secondary }}>{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            )}

            {enabledSections.find(s => s.type === 'skills') && skills.length > 0 && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: colors.primary, borderBottom: `1px solid ${colors.primary}40`, paddingBottom: '4px', marginBottom: '8px' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map(skill => (
                    <span key={skill.id} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '4px', backgroundColor: colors.accent, color: colors.primary }}>{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'minimal':
        return (
          <div style={{ fontFamily: font, fontSize: baseFontSize, lineHeight: '1.6', padding: baseSpacing, backgroundColor: colors.bg, color: colors.text, maxWidth: '700px', minHeight: '297mm' }}>
            <div style={{ marginBottom: baseSpacing }}>
              <h1 style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '2px', margin: '0 0 4px 0' }}>{personalInfo.fullName || 'Your Name'}</h1>
              <div style={{ fontSize: '13px', color: colors.secondary, marginBottom: '8px' }}>{personalInfo.title}</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: colors.secondary, flexWrap: 'wrap' }}>
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>

            {personalInfo.summary && (
              <p style={{ fontSize: '13px', color: colors.secondary, marginBottom: baseSpacing }}>{personalInfo.summary}</p>
            )}

            {enabledSections.find(s => s.type === 'experience') && experiences.length > 0 && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px', color: colors.primary, marginBottom: '12px' }}>Experience</h3>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600 }}>{exp.position}</span>
                      <span style={{ fontSize: '11px', color: colors.secondary }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: colors.secondary, marginBottom: '4px' }}>{exp.company}</div>
                    {exp.achievements.filter(a => a.trim()).length > 0 && (
                      <div>
                        {exp.achievements.filter(a => a.trim()).map((ach, i) => (
                          <div key={i} style={{ fontSize: '12px', color: colors.secondary, marginBottom: '2px' }}>— {ach}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {enabledSections.find(s => s.type === 'skills') && skills.length > 0 && (
              <div style={{ marginBottom: baseSpacing }}>
                <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px', color: colors.primary, marginBottom: '12px' }}>Skills</h3>
                {skills.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', width: '100px' }}>{skill.name}</span>
                    <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: colors.accent }}>
                      <div style={{ width: `${(skill.level / 5) * 100}%`, height: '100%', borderRadius: '2px', backgroundColor: colors.primary }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {enabledSections.find(s => s.type === 'education') && education.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px', color: colors.primary, marginBottom: '12px' }}>Education</h3>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: colors.secondary }}>{edu.degree}, {edu.field} • {edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Select a template style from settings</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'edit' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>✏️ Edit</button>
              <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>👁️ Preview</button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>⚙️ Settings</button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={undo} disabled={undoStack.length === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors" title="Undo">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button onClick={redo} disabled={redoStack.length === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors" title="Redo">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
              </button>
              <div className="w-px h-6 bg-gray-700" />
              <button onClick={loadSampleData} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-all">📋 Sample</button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                📥 Import
                <input type="file" accept=".json" onChange={importFromJSON} className="hidden" />
              </label>
              <button onClick={exportToJSON} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-all">💾 JSON</button>
              <button onClick={exportToPDF} className="text-xs bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:shadow-lg transition-all">📄 PDF</button>
              {lastSaved && <span className="text-xs text-gray-600 hidden sm:inline">Saved {lastSaved.toLocaleTimeString()}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Edit Panel */}
        {activeTab === 'edit' && (
          <div className="w-96 bg-gray-900/50 border-r border-gray-800 overflow-y-auto p-4 space-y-4 flex-shrink-0">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {[
                { id: 'personal', label: 'Personal', icon: '👤' },
                { id: 'experience', label: 'Experience', icon: '💼' },
                { id: 'education', label: 'Education', icon: '🎓' },
                { id: 'skills', label: 'Skills', icon: '⚡' },
                { id: 'projects', label: 'Projects', icon: '🚀' },
                { id: 'certifications', label: 'Certs', icon: '📜' },
              ].map(section => (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${activeSection === section.id ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  <span>{section.icon}</span>
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Personal Info Form */}
            {activeSection === 'personal' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Personal Information</h3>
                {[
                  { field: 'fullName' as keyof PersonalInfo, label: 'Full Name', placeholder: 'John Doe' },
                  { field: 'title' as keyof PersonalInfo, label: 'Professional Title', placeholder: 'Software Engineer' },
                  { field: 'email' as keyof PersonalInfo, label: 'Email', placeholder: 'john@email.com', type: 'email' },
                  { field: 'phone' as keyof PersonalInfo, label: 'Phone', placeholder: '+1 (555) 000-0000' },
                  { field: 'location' as keyof PersonalInfo, label: 'Location', placeholder: 'City, State' },
                  { field: 'linkedin' as keyof PersonalInfo, label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
                  { field: 'website' as keyof PersonalInfo, label: 'Website/Portfolio', placeholder: 'johndoe.com' },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input type={type || 'text'} className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none transition-all placeholder-gray-600"
                      value={resumeData.personalInfo[field]} onChange={(e) => updatePersonalInfo(field, e.target.value)} placeholder={placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Professional Summary</label>
                  <textarea className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none transition-all placeholder-gray-600 min-h-[100px] resize-y"
                    value={resumeData.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Brief overview of your professional background..." />
                </div>
              </div>
            )}

            {/* Experience Form */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Work Experience</h3>
                  <button onClick={addExperience} className="text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-500 transition-all">+ Add</button>
                </div>
                {resumeData.experiences.map((exp, index) => (
                  <div key={exp.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Experience #{index + 1}</span>
                      <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Start" />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} placeholder="End" />
                      <label className="flex items-center gap-1 text-xs text-gray-400">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded" /> Current
                      </label>
                    </div>
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Location" value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} />
                    <div>
                      <label className="text-xs text-gray-500">Achievements</label>
                      {exp.achievements.map((ach, i) => (
                        <div key={i} className="flex gap-1 mt-1">
                          <input className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder={`Achievement ${i + 1}`} value={ach} onChange={(e) => updateAchievement(exp.id, i, e.target.value)} />
                          {exp.achievements.length > 1 && (
                            <button onClick={() => removeAchievement(exp.id, i)} className="text-red-400 hover:text-red-300 px-1">×</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addAchievement(exp.id)} className="text-xs text-violet-400 hover:text-violet-300 mt-1">+ Add achievement</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Form */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Education</h3>
                  <button onClick={addEducation} className="text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-500 transition-all">+ Add</button>
                </div>
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Education #{index + 1}</span>
                      <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="School/University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Field of Study" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Start Year" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="End Year" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="GPA" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Form */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Skills</h3>
                  <button onClick={addSkill} className="text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-500 transition-all">+ Add</button>
                </div>
                {resumeData.skills.map((skill, index) => (
                  <div key={skill.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Skill #{index + 1}</span>
                      <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Skill name" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} />
                      <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" value={skill.category} onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}>
                        <option value="Technical">Technical</option>
                        <option value="Soft">Soft Skills</option>
                        <option value="Languages">Languages</option>
                        <option value="Tools">Tools</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Proficiency: {skill.level}/5</label>
                      <input type="range" min="1" max="5" value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} className="w-full accent-violet-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Form */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Projects</h3>
                  <button onClick={addProject} className="text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-500 transition-all">+ Add</button>
                </div>
                {resumeData.projects.map((proj, index) => (
                  <div key={proj.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Project #{index + 1}</span>
                      <button onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Project name" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                    <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none min-h-[60px] resize-y" placeholder="Description" value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Link (optional)" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} />
                    <div>
                      <label className="text-xs text-gray-500">Technologies (comma-separated)</label>
                      <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none mt-1"
                        placeholder="React, Node.js, AWS"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications Form */}
            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Certifications</h3>
                  <button onClick={addCertification} className="text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-500 transition-all">+ Add</button>
                </div>
                {resumeData.certifications.map((cert, index) => (
                  <div key={cert.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Cert #{index + 1}</span>
                      <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Certification name" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
                    <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Issuing organization" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Date" value={cert.date} onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} />
                      <input className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-violet-500 outline-none" placeholder="Link (optional)" value={cert.link} onChange={(e) => updateCertification(cert.id, 'link', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Panel */}
        {activeTab === 'settings' && (
          <div className="w-80 bg-gray-900/50 border-r border-gray-800 overflow-y-auto p-4 space-y-4 flex-shrink-0">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Template Settings</h3>
            
            <div>
              <label className="text-xs text-gray-500">Template Style</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 mt-1" value={templateConfig.type} onChange={(e) => setTemplateConfig(prev => ({ ...prev, type: e.target.value as TemplateType }))}>
                <option value="modern">Modern (Sidebar)</option>
                <option value="classic">Classic (Traditional)</option>
                <option value="minimal">Minimal (Clean)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Font Family</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 mt-1" value={templateConfig.font} onChange={(e) => setTemplateConfig(prev => ({ ...prev, font: e.target.value as FontFamily }))}>
                <option value="inter">Inter</option>
                <option value="roboto">Roboto</option>
                <option value="playfair">Playfair Display</option>
                <option value="mono">JetBrains Mono</option>
                <option value="calibri">Calibri</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Color Scheme</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(Object.keys(colorSchemes) as ColorScheme[]).map(color => (
                  <button key={color} onClick={() => setTemplateConfig(prev => ({ ...prev, colorScheme: color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${templateConfig.colorScheme === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: colorSchemes[color].primary }} title={color} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Font Size</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 mt-1" value={templateConfig.fontSize} onChange={(e) => setTemplateConfig(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Spacing</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 mt-1" value={templateConfig.spacing} onChange={(e) => setTemplateConfig(prev => ({ ...prev, spacing: e.target.value as 'compact' | 'normal' | 'spacious' }))}>
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block">Visible Sections (drag to reorder)</label>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={resumeData.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {resumeData.sections.map(section => (
                      <SortableSection key={section.id} section={section}>
                        <label className="flex items-center justify-between flex-1 bg-gray-950 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-900 transition-all">
                          <span className="text-sm text-gray-300">{section.title}</span>
                          <input type="checkbox" checked={section.enabled}
                            onChange={() => {
                              pushToUndo();
                              setResumeData(prev => ({
                                ...prev,
                                sections: prev.sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s),
                              }));
                            }}
                            className="rounded accent-violet-500" />
                        </label>
                      </SortableSection>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        {/* Preview Panel (always visible on the right) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800/30 flex items-start justify-center">
          <div ref={previewRef} style={{ transform: activeTab === 'preview' ? 'scale(1)' : 'scale(0.7)', transformOrigin: 'top center', transition: 'transform 0.3s' }}>
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}