"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function AIControllerPanel() {

  const params = useParams();
  const hackathonId = params.hackathonId;

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-2xl font-bold mb-8">
        AI Control Panel
      </h1>

      <div className="grid grid-cols-2 gap-4 max-w-xl">

        <Link
          href={`/admin/hackathons/ai-classifier?hackathonId=${hackathonId}`}
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          AI Classifier
        </Link>

        <Link
          href={`/admin/hackathons/ai-plagiarism?hackathonId=${hackathonId}`}
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          Plagiarism Check
        </Link>

        <Link
          href={`/admin/hackathons/ai-judge?hackathonId=${hackathonId}`}
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          Judge Project
        </Link>

        <Link
          href={`/admin/hackathons/ai-usage-decision?hackathonId=${hackathonId}`}
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          Usage Decision
        </Link>

        <Link
          href={`/admin/hackathons/ai-usage-stats`}
          className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          Usage Stats
        </Link>

      </div>

    </div>

  );
}