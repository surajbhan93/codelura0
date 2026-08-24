import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-[#f9f5ef] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mb-3">Blog Not Found</h1>
        <p className="text-[#7a7065] mb-8">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link 
          href="/blogs" 
          className="inline-block bg-[#c8410a] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c8410a]/90 transition-colors"
        >
          Browse All Blogs
        </Link>
      </div>
    </div>
  );
}