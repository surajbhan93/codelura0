// app/resume-templates/components/TemplatePreviewSVG.tsx
'use client';

import type { ReactElement } from 'react';
import type { TemplateConfig, TemplateColor, TemplateFont } from '@/lib/resume-templates/type';

interface TemplatePreviewSVGProps {
  config: TemplateConfig;
  className?: string;
}

const ACCENT_HEX: Record<TemplateColor, string> = {
  blue: '#60a5fa',
  green: '#4ade80',
  purple: '#c084fc',
  red: '#f87171',
  teal: '#2dd4bf',
  orange: '#fb923c',
  gray: '#cbd5e1',
  black: '#f1f5f9',
};

const FONT_STACK: Record<TemplateFont, string> = {
  inter: '"Inter", "Segoe UI", sans-serif',
  roboto: '"Roboto", "Segoe UI", sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  mono: '"JetBrains Mono", "SFMono-Regular", monospace',
  calibri: 'Calibri, "Segoe UI", sans-serif',
};

const SPACING_MULTIPLIER: Record<TemplateConfig['spacing'], number> = {
  compact: 0.8,
  normal: 1,
  spacious: 1.25,
};

const SECTION_ORDER: { key: keyof TemplateConfig['sections']; label: string; kind: 'lines' | 'pills' }[] = [
  { key: 'experience', label: 'EXPERIENCE', kind: 'lines' },
  { key: 'education', label: 'EDUCATION', kind: 'lines' },
  { key: 'skills', label: 'SKILLS', kind: 'pills' },
  { key: 'projects', label: 'PROJECTS', kind: 'lines' },
  { key: 'certifications', label: 'CERTIFICATIONS', kind: 'lines' },
  { key: 'languages', label: 'LANGUAGES', kind: 'pills' },
];

const LINE_WIDTHS = [0.92, 0.68, 0.8, 0.55];
const PILL_WIDTHS = [30, 42, 26, 36, 24];

/**
 * Renders a lightweight, deterministic SVG mock-up of a resume based on the
 * template's own configuration (layout, color, font, spacing, sections).
 * This gives the template grid a real visual preview instead of a static
 * emoji placeholder, while staying cheap enough to render dozens at once.
 */
export default function TemplatePreviewSVG({ config, className }: TemplatePreviewSVGProps) {
  const accent = ACCENT_HEX[config.colorScheme];
  const fontFamily = FONT_STACK[config.font];
  const gapMult = SPACING_MULTIPLIER[config.spacing];
  const lineColor = '#4b5563';
  const bodyColor = '#374151';

  const enabledSections = SECTION_ORDER.filter((s) => config.sections[s.key]);

  // ---- building blocks -----------------------------------------------

  function sectionBlock(
    section: (typeof SECTION_ORDER)[number],
    x: number,
    y: number,
    width: number,
    index: number
  ): { node: ReactElement; height: number } {
    const headerH = 10;
    const gap = 5 * gapMult;

    if (section.kind === 'pills') {
      const pillH = 11;
      const pillGap = 5;
      let cx = x;
      let cy = y + headerH + gap;
      const pillNodes: ReactElement[] = [];
      let row = 0;
      PILL_WIDTHS.forEach((w, i) => {
        if (cx + w > x + width) {
          cx = x;
          cy += pillH + 4;
          row += 1;
        }
        if (row < 2) {
          pillNodes.push(
            <rect
              key={i}
              x={cx}
              y={cy}
              width={w}
              height={pillH}
              rx={pillH / 2}
              fill="none"
              stroke={accent}
              strokeWidth={1}
              opacity={0.85}
            />
          );
          cx += w + pillGap;
        }
      });
      const blockHeight = headerH + gap + (row + 1) * (pillH + 4);
      return {
        height: blockHeight + gap,
        node: (
          <g key={section.key}>
            <text x={x} y={y + 7} fontSize={7} fontWeight={700} letterSpacing={0.5} fill={accent} fontFamily={fontFamily}>
              {section.label}
            </text>
            {pillNodes}
          </g>
        ),
      };
    }

    // "lines" kind: two mock entries, each with a bold title line + 2 grey lines
    const entryGap = 6 * gapMult;
    const lineGap = 4.5 * gapMult;
    const entries = [0, 1];
    let cursorY = y + headerH + gap;
    const entryNodes: ReactElement[] = [];
    entries.forEach((e) => {
      entryNodes.push(
        <rect key={`t-${e}`} x={x} y={cursorY} width={width * 0.6} height={3.2} rx={1.2} fill={bodyColor} />
      );
      cursorY += lineGap + 1;
      entryNodes.push(
        <rect key={`s-${e}`} x={x} y={cursorY} width={width * 0.35} height={2.4} rx={1} fill={accent} opacity={0.7} />
      );
      cursorY += lineGap;
      LINE_WIDTHS.slice(0, 2).forEach((w, li) => {
        entryNodes.push(
          <rect key={`l-${e}-${li}`} x={x} y={cursorY} width={width * w} height={2.4} rx={1} fill={lineColor} />
        );
        cursorY += lineGap;
      });
      cursorY += entryGap;
    });

    return {
      height: cursorY - y,
      node: (
        <g key={section.key}>
          <text x={x} y={y + 7} fontSize={7} fontWeight={700} letterSpacing={0.5} fill={accent} fontFamily={fontFamily}>
            {section.label}
          </text>
          {entryNodes}
        </g>
      ),
    };
  }

  function stackSections(x: number, startY: number, width: number) {
    let y = startY;
    const nodes: ReactElement[] = [];
    enabledSections.forEach((s, i) => {
      const { node, height } = sectionBlock(s, x, y, width, i);
      nodes.push(node);
      y += height;
    });
    return nodes;
  }

  function contactBlock(x: number, y: number, width: number, dark: boolean) {
    const textColor = dark ? '#e5e7eb' : '#6b7280';
    return (
      <g>
        {config.showIcons && <circle cx={x + 8} cy={y} r={8} fill="none" stroke={accent} strokeWidth={1.2} />}
        <rect x={x} y={y + 16} width={width} height={2.2} rx={1} fill={textColor} opacity={0.8} />
        <rect x={x} y={y + 22} width={width * 0.75} height={2.2} rx={1} fill={textColor} opacity={0.6} />
        <rect x={x} y={y + 28} width={width * 0.6} height={2.2} rx={1} fill={textColor} opacity={0.6} />
      </g>
    );
  }

  // ---- header (name + title), shared across layouts -------------------

  const header = (
    <g>
      <text x={16} y={28} fontSize={15} fontWeight={700} fill="#f8fafc" fontFamily={fontFamily}>
        Alex Morgan
      </text>
      <text x={16} y={40} fontSize={8} fill={accent} fontFamily={fontFamily} letterSpacing={0.3}>
        Senior Product Designer
      </text>
      {config.showBorders && <line x1={16} y1={48} x2={224} y2={48} stroke="#334155" strokeWidth={1} />}
    </g>
  );

  // ---- layout composition ----------------------------------------------

  let body: ReactElement;

  if (config.layout_type === 'single-column') {
    body = (
      <g>
        {header}
        {stackSections(16, 58, 208)}
      </g>
    );
  } else if (config.layout_type === 'two-column') {
    body = (
      <g>
        {header}
        {config.showBorders && <line x1={84} y1={58} x2={84} y2={310} stroke="#334155" strokeWidth={1} />}
        <g>{contactBlock(16, 66, 58, false)}</g>
        {stackSections(16, 106, 58)}
        {stackSections(96, 58, 128)}
      </g>
    );
  } else if (config.layout_type === 'sidebar') {
    body = (
      <g>
        <rect x={0} y={0} width={78} height={320} fill={accent} opacity={0.14} />
        <rect x={0} y={0} width={78} height={320} fill="none" stroke={accent} strokeOpacity={0.4} strokeWidth={1} />
        <text x={14} y={28} fontSize={13} fontWeight={700} fill="#f8fafc" fontFamily={fontFamily}>
          Alex
        </text>
        <text x={14} y={41} fontSize={13} fontWeight={700} fill="#f8fafc" fontFamily={fontFamily}>
          Morgan
        </text>
        {contactBlock(14, 58, 54, true)}
        <g transform="translate(14, 110)">{stackSections(0, 0, 50)}</g>
        <g transform="translate(94, 20)">
          <text x={0} y={12} fontSize={8} fill={accent} fontFamily={fontFamily} letterSpacing={0.3}>
            Senior Product Designer
          </text>
          {config.showBorders && <line x1={0} y1={20} x2={130} y2={20} stroke="#334155" strokeWidth={1} />}
          {stackSections(0, 32, 130)}
        </g>
      </g>
    );
  } else {
    // hybrid: full-width header band, then two columns below
    body = (
      <g>
        <rect x={0} y={0} width={240} height={52} fill={accent} opacity={0.16} />
        <text x={16} y={24} fontSize={14} fontWeight={700} fill="#f8fafc" fontFamily={fontFamily}>
          Alex Morgan
        </text>
        <text x={16} y={38} fontSize={8} fill={accent} fontFamily={fontFamily} letterSpacing={0.3}>
          Senior Product Designer · San Francisco
        </text>
        {config.showBorders && <line x1={100} y1={64} x2={100} y2={310} stroke="#334155" strokeWidth={1} />}
        {stackSections(16, 64, 76)}
        {stackSections(112, 64, 112)}
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 240 320"
      className={className}
      preserveAspectRatio="xMidYMin slice"
      style={{ width: '100%', height: '100%', background: '#111827' }}
    >
      {body}
    </svg>
  );
}