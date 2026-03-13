"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/api";

/* ================= TYPES ================= */

interface Program {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  platformLink: string;
  image?: string;
  points: string[];
  order: number;
  clickCount: number;
  isActive: boolean;
}

interface ProgramForm {
  name: string;
  shortDescription: string;
  category: string;
  platformLink: string;
  image: string;
  order: number;
  isActive: boolean;
  points: string[];
}

/* ================= COMPONENT ================= */

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ProgramForm>({
    name: "",
    shortDescription: "",
    category: "Other",
    platformLink: "",
    image: "",
    order: 0,
    isActive: true,
    points: [""],
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const fetchPrograms = async () => {
    try {
      const { data } = await api.get("/admin/program");
      if (data.success) {
        setPrograms(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  /* ================= INPUT HANDLER ================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  /* ================= POINTS ================= */

  const handlePointChange = (index: number, value: string) => {
    const updatedPoints = [...form.points];
    updatedPoints[index] = value;
    setForm((prev) => ({ ...prev, points: updatedPoints }));
  };

  const addPoint = () => {
    setForm((prev) => ({ ...prev, points: [...prev.points, ""] }));
  };

  const removePoint = (index: number) => {
    const updatedPoints = form.points.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, points: updatedPoints }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/program/${editingId}`, form);
      } else {
        await api.post("/admin/program", form);
      }

      setForm({
        name: "",
        shortDescription: "",
        category: "Other",
        platformLink: "",
        image: "",
        order: 0,
        isActive: true,
        points: [""],
      });

      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (program: Program) => {
    setForm({
      name: program.name,
      shortDescription: program.shortDescription,
      category: program.category,
      platformLink: program.platformLink,
      image: program.image || "",
      order: program.order,
      isActive: program.isActive,
      points: program.points?.length ? program.points : [""],
    });

    setEditingId(program._id);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/program/${id}`);
    fetchPrograms();
  };

  /* ================= UI ================= */

  return (
    <div className="p-10 text-white bg-[#0B0F19] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-orange-500">
        Manage Career Programs
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-[#121826] p-6 rounded-xl mb-12"
      >
        <input
          name="name"
          placeholder="Program Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-[#1B2435] rounded"
          required
        />

        <textarea
          name="shortDescription"
          placeholder="Short Description"
          value={form.shortDescription}
          onChange={handleChange}
          className="w-full p-3 bg-[#1B2435] rounded"
          required
        />

        <input
          name="platformLink"
          placeholder="Unolearning Link"
          value={form.platformLink}
          onChange={handleChange}
          className="w-full p-3 bg-[#1B2435] rounded"
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-3 bg-[#1B2435] rounded"
        />

        <input
          name="order"
          type="number"
          placeholder="Display Order"
          value={form.order}
          onChange={handleChange}
          className="w-full p-3 bg-[#1B2435] rounded"
        />

        {/* POINTS */}
        <div>
          <h3 className="mb-2">Points:</h3>

          {form.points.map((point, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={point}
                onChange={(e) =>
                  handlePointChange(index, e.target.value)
                }
                className="w-full p-3 bg-[#1B2435] rounded"
              />
              <button
                type="button"
                onClick={() => removePoint(index)}
                className="bg-red-500 px-3 rounded"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPoint}
            className="bg-orange-500 px-4 py-2 rounded mt-2"
          >
            + Add Point
          </button>
        </div>

        <button className="bg-orange-500 px-6 py-3 rounded-lg font-semibold">
          {editingId ? "Update Program" : "Create Program"}
        </button>
      </form>

      {/* LIST */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          programs.map((program) => (
            <div
              key={program._id}
              className="bg-[#121826] p-6 rounded-lg mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{program.name}</h3>
                <p className="text-gray-400 text-sm">
                  {program.slug}
                </p>
                <p className="text-orange-400 text-sm mt-1">
                  Clicks: {program.clickCount || 0}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(program)}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(program._id)}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}