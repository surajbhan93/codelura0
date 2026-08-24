import AdminJobForm from "@/components/admin/AdminJobForm";

export default function CreateBlogPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold mb-4">Create Blog</h1>
      <AdminJobForm />
    </div>
  );
}

// Edit page
{/* <AdminJobForm isEdit jobId={job._id} initialData={job} /> */}