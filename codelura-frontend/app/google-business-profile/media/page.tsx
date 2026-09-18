"use client";
import { Image } from "lucide-react";

export default function MediaPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Media Gallery</h1>
        <p className="text-sm text-slate-500">Photos and videos uploaded to Google Business Profile</p>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <Image className="h-12 w-12 text-slate-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Media Management</h3>
        <p className="text-slate-500 text-sm max-w-md">Upload exterior, interior, team, and product photos directly to your Google Business Profile to boost engagement.</p>
      </div>
    </div>
  );
}
