"use client";
import { useEffect, useState } from "react";
// import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
// import apiClient from "@/lib/adminApi";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ======================
   TYPES
====================== */
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  isFounder?: boolean; // 👈 ADD
}


/* ======================
   PAGE
====================== */
export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const [form, setForm] = useState({
  name: "",
  role: "",
  bio: "",
  image: "",
  linkedin: "",
  isFounder: false, // 👈 ADD
});


  /* ======================
     FETCH TEAM
  ====================== */
  const fetchTeam = async () => {
    try {
      const res = await api.get("/team");
      setTeam(res.data.data || []);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  /* ======================
     FORM HANDLERS
  ====================== */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({
      name: "",
      role: "",
      bio: "",
      image: "",
      linkedin: "",
      isFounder: false, // 👈 ADD
    });
    setOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditing(m);
    setForm({
        name: m.name,
        role: m.role,
        bio: m.bio || "",
        image: m.image || "",
        linkedin: m.linkedin || "",
        isFounder: m.isFounder || false, // 👈 ADD
      });

    setOpen(true);
  };

  /* ======================
     SUBMIT (ADD / UPDATE)
  ====================== */
  const submitForm = async () => {
    try {
      if (editing) {
        await api.put(`/team/${editing._id}`, form);
        toast.success("Team member updated");
      } else {
        await api.post("/team", form);
        toast.success("Team member added");
      }

      setOpen(false);
      fetchTeam();
    } catch {
      toast.error("Action failed");
    }
  };

  /* ======================
     DELETE
  ====================== */
  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team member?")) return;

    try {
      await api.delete(`/team/${id}`);
      toast.success("Team member deleted");
      fetchTeam();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    // <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Team Management</h1>

          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Member
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : team.length === 0 ? (
          <p className="text-gray-500">No team members found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((m) => (
                  <tr key={m._id} className="border-t">
                    <td className="p-4 font-medium">{m.name}</td>
                    <td className="p-4">{m.role}</td>
                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => openEditModal(m)}
                        className="text-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTeam(m._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Team Member" : "Add Team Member"}
              </h2>

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="role"
                placeholder="Role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="bio"
                placeholder="Bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="linkedin"
                placeholder="LinkedIn URL"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
               
               <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFounder}
                onChange={(e) =>
                  setForm({ ...form, isFounder: e.target.checked })
                }
              />
              Set as Founder
            </label>


              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={submitForm}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    // </AdminDashboardLayout>
  );
}
