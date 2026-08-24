// lib/resume-templates/types.ts

export type TemplateCategory =
  | 'modern'
  | 'classic'
  | 'creative'
  | 'minimal'
  | 'executive'
  | 'tech'
  | 'ats';

export type TemplateColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'teal'
  | 'orange'
  | 'gray'
  | 'black';

export type TemplateLayout = 'single-column' | 'two-column' | 'sidebar' | 'hybrid';

export type TemplateFont = 'inter' | 'roboto' | 'playfair' | 'mono' | 'calibri';

export interface TemplateSections {
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  languages: boolean;
}

export interface TemplateConfig {
  type: 'modern' | 'classic' | 'minimal';
  font: TemplateFont;
  colorScheme: TemplateColor;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  showIcons: boolean;
  showBorders: boolean;
  sections: TemplateSections;
  layout_type: TemplateLayout;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  colors: TemplateColor[];
  layout: TemplateLayout;
  preview: string;
  description: string;
  features: string[];
  bestFor: string[];
  atsScore: number;
  popularity: number;
  isPremium: boolean;
  config: TemplateConfig;
}