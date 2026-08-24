// app/career-tracks/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Tracks - Codelura Careers',
  description: 'Structured learning paths with real projects, mentor support, and certificates.',
};

export default function CareerTracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}