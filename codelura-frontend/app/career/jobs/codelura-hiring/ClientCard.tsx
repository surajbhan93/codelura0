// ClientCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ClientCardProps {
  title: string;
  description: string;
  linkText: string;
  variant?: 'primary' | 'secondary';
  type?: 'ats' | 'resume' | 'freelance';
  slug?: string; // Add slug prop
}

export default function ClientCard({
  title,
  description,
  linkText,
  // variant = 'secondary',
  type = 'ats',
  slug, // Receive slug
}: ClientCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine the href based on type and slug
  const getHref = () => {
    if (slug) {
      return `/career/tools/${slug}`;
    }
    
    // Fallback routes
    switch (type) {
      case 'ats':
        return '/career/tools/ats-resume-checker';
      case 'resume':
        return '/career/tools/resume-builder';
      case 'freelance':
        return 'https://forms.gle/zYx3wYQj5WRiaNTN6';
      default:
        return '#';
    }
  };

  const href = getHref();
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex items-center justify-between gap-6 py-5 hover:bg-[#151922] transition-colors -mx-2 px-2 rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="min-w-0">
        <p className="text-sm text-[#eef1f6] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
          <span className="text-[#565f6e]">$</span> {title}
        </p>
        <p className="text-[13px] text-[#9099a8] truncate">{description}</p>
        
        {/* Show slug hint on hover */}
        {slug && isHovered && (
          <p className="text-[10px] text-[#45d8c0] mt-1 font-mono opacity-70">
            → /career/tools/{slug}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-3">
        {/* Status indicator */}
        {type === 'ats' && (
          <span className="hidden sm:inline-block text-[10px] px-2 py-1 rounded bg-[#242a35] text-[#9099a8] font-mono">
            ATS v2.1
          </span>
        )}
        {type === 'resume' && (
          <span className="hidden sm:inline-block text-[10px] px-2 py-1 rounded bg-[#242a35] text-[#9099a8] font-mono">
            builder
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-sm text-[#45d8c0] group-hover:gap-2.5 transition-all">
          {linkText}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}