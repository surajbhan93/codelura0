"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get("/admin/services").then((res) => {
      const service = res.data.data.find((s) => s._id === id);
      setForm(service);
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await api.put(`/admin/services/${id}`, form);
    router.push("/admin/services");
  };

  if (!form) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="input"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="input"
          value={form.shortDescription}
          onChange={(e) =>
            setForm({ ...form, shortDescription: e.target.value })
          }
        />

        <textarea
          className="input"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="px-4 py-2 bg-black text-white rounded">
          Update Service
        </button>
      </form>
    </div>
  );
}
