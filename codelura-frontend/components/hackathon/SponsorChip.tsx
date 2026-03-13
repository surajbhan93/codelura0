"use client";

interface Sponsor {
  _id: string;
  name: string;
  logo?: string;
  website: string;
}

export default function SponsorChip({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-chip flex items-center gap-3 px-5 py-3"
    >
      {sponsor.logo && (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="h-6 w-auto object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <span className="text-sm font-semibold text-white">{sponsor.name}</span>
      <span className="text-gray-500 text-xs">↗</span>
    </a>
  );
}