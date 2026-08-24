import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-900/60 border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm text-slate-400 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <Link href="/locations" className="hover:text-cyan-400 transition-colors">
          Locations
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-slate-300">Prayagraj</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">App Development Company in Prayagraj</span>
      </div>
    </nav>
  );
}
