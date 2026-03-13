"use client";

interface Judge {
  _id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
}

export default function JudgeCard({ judge }: { judge: Judge }) {
  return (
    <div className="judge-card p-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-violet-900/40 border border-violet-700/30 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
        {judge.image ? (
          <img
            src={judge.image}
            alt={judge.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          "👤"
        )}
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{judge.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{judge.role}</p>
        <p className="text-xs text-violet-400 font-medium mt-0.5">{judge.company}</p>
      </div>
    </div>
  );
}