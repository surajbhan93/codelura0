"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button, Badge, Card } from "flowbite-react";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/admin/blogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setBlogs(res.data);
    } catch (err: any) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await api.delete(`/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.patch(
        `/admin/blogs/${id}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Blog published");
      fetchBlogs();
    } catch {
      toast.error("Publish failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📚 All Blogs</h1>

        <Button
          onClick={() => router.push("/admin/blogs/create")}
          className="bg-indigo-600"
        >
          + Create Blog
        </Button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-white">No blogs found</p>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              className="bg-black/80 border border-white/10 text-white"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {blog.isPublished ? (
                    <Badge color="success">Published</Badge>
                  ) : (
                    <Badge color="warning">Draft</Badge>
                  )}

                  <Button
                    size="xs"
                    color="gray"
                    onClick={() =>
                      router.push(`/admin/blogs/edit/${blog._id}`)
                    }
                  >
                    Edit
                  </Button>

                  {!blog.isPublished && (
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => handlePublish(blog._id)}
                    >
                      Publish
                    </Button>
                  )}

                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}