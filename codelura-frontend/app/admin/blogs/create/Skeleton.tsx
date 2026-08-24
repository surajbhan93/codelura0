// components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className || ""}`} />
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}