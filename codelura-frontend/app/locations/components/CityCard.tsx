import Link from 'next/link';
import { CityLocation } from '../constants';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CityCardProps {
  city: CityLocation;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/50 transition-all group shadow-xl hover:shadow-cyan-500/10">
      <div className="space-y-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.state}</span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
            {city.serviceCount} Local Services
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
          {city.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-400 text-sm leading-relaxed min-h-[48px]">
          {city.shortDesc}
        </p>

        {/* Popular Services Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300 block">
            Popular Services in {city.name.split(' ')[0]}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {city.popularServices.map((svc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-800"
              >
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                <span>{svc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Child Sub-Service Links Preview */}
        {city.services.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-slate-400 font-medium block">Key Service Landing Pages:</span>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {city.services.slice(0, 4).map((s, sIdx) => (
                <Link
                  key={sIdx}
                  href={s.url}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline truncate inline-block"
                >
                  • {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-6 border-t border-slate-800 mt-6">
        <Link
          href={city.hubUrl}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
        >
          <span>View {city.name} Location Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
