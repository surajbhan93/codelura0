
// // app/admin/blogs/edit/[id]/page.tsx (Server Component)
// import { Suspense } from "react";
// import { redirect, notFound } from "next/navigation";
// import { cookies } from "next/headers";
// import AdminBlogForm from "@/components/admin/AdminBlogForm";

// // ─── Fetch Blog Data on Server ───
// async function getBlog(id: string) {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token");
  
//   if (!token) {
//     redirect("/admin/login");
//   }
  
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token.value}`
//       },
//       cache: "no-store" // For real-time data
//     });
    
//     if (!response.ok) {
//       return null;
//     }
    
//     return response.json();
//   } catch {
//     return null;
//   }
// }

// export default async function EditBlogPage({ params }: { params: { id: string } }) {
//   const blog = await getBlog(params.id);
  
//   if (!blog) {
//     notFound();
//   }
  
//   return (
//     <Suspense fallback={<AdminFormSkeleton />}>
//       <AdminBlogForm initialData={blog} isEdit blogId={params.id} />
//     </Suspense>
//   );
// }
// app/admin/blogs/edit/[id]/page.tsx (Server Component)
import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import AdminBlogForm from "@/components/admin/AdminBlogForm";

// ─── Loading Skeleton ───
function AdminFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse" />
      <div className="h-40 bg-white/10 rounded-xl animate-pulse" />
      <div className="h-64 bg-white/10 rounded-xl animate-pulse" />
      <div className="h-32 bg-white/10 rounded-xl animate-pulse" />
      <div className="h-32 bg-white/10 rounded-xl animate-pulse" />
    </div>
  );
}

// ─── Fetch Blog Data on Server ───
async function getBlog(id: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  
  if (!token) {
    redirect("/admin/login");
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      cache: "no-store"
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch {
    return null;
  }
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);
  
  if (!blog) {
    notFound();
  }
  
  return (
    <Suspense fallback={<AdminFormSkeleton />}>
      <AdminBlogForm initialData={blog} isEdit blogId={params.id} />
    </Suspense>
  );
}