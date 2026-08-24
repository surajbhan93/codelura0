export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      <div className="max-w-[820px] mx-auto px-6 py-12">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-[420px] bg-gray-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-9/12" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8/12" />
        </div>
      </div>
    </div>
  );
}