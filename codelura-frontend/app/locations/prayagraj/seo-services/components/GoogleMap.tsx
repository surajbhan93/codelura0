'use client';

import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapProps {
  embedUrl: string;
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function GoogleMap({ embedUrl, title, address, coordinates }: GoogleMapProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden relative shadow-2xl space-y-4">
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <MapPin className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div className="text-slate-400 font-mono">
          {coordinates.lat}° N, {coordinates.lng}° E
        </div>
      </div>

      <div className="h-[320px] rounded-2xl overflow-hidden relative border border-slate-800 bg-slate-950">
        <iframe
          title={title}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
        />
        <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 flex items-center gap-1.5 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Civil Lines, Prayagraj</span>
        </div>
      </div>

      <div className="px-2 text-xs text-slate-400 flex items-center justify-between">
        <span>{address}</span>
      </div>
    </div>
  );
}
