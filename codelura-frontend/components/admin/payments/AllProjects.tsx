"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface ProjectPayment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  projectName: string;
  projectDescription?: string;
  totalProjectAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
  emiAmount: number;
  numberOfEmis: number;
  status: string;
  createdAt: string;
}

export default function AllProjects() {
  const [projects, setProjects] = useState<ProjectPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [creatingClient, setCreatingClient] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    projectName: "",
    projectDescription: "",
    totalProjectAmount: "",
    emiAmount: "",
    numberOfEmis: "",
    emiStartDate: "",
    emiFrequency: "monthly",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = statusFilter
        ? `${API_BASE_URL}/api/payments/admin/all-projects?status=${statusFilter}`
        : `${API_BASE_URL}/api/payments/admin/all-projects`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data.projects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/payment-clients/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Payment clients fetched:", response.data); // Debug
      setUsers(response.data.clients || []);
    } catch (error: any) {
      console.error("Error fetching payment clients:", error);
      console.error("Error response:", error.response?.data); // Debug
      toast.error("Failed to load payment clients");
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingClient(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/payment-clients/admin/create`,
        newClient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const credentials = response.data.credentials;

      toast.success(
        `✅ Payment Client Created!\n\n` +
        `📧 Email: ${credentials.email}\n` +
        `👤 Username: ${credentials.username}\n` +
        `🔑 Password: ${credentials.password}\n\n` +
        `Share these credentials for payment portal access.`,
        { duration: 15000 }
      );
      
      // Reset form
      setNewClient({ name: "", email: "", password: "", phone: "" });
      setShowCreateClientForm(false);
      
      // Refresh users list
      await fetchUsers();
      
      // Auto-select the newly created client
      if (response.data.client._id) {
        setFormData({ ...formData, userId: response.data.client._id });
      }
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(error.response?.data?.message || "Failed to create client");
    } finally {
      setCreatingClient(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/payments/admin/create-project`,
        {
          ...formData,
          totalProjectAmount: Number(formData.totalProjectAmount),
          emiAmount: Number(formData.emiAmount),
          numberOfEmis: Number(formData.numberOfEmis),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Project created successfully!");
      setShowCreateModal(false);
      setFormData({
        userId: "",
        projectName: "",
        projectDescription: "",
        totalProjectAmount: "",
        emiAmount: "",
        numberOfEmis: "",
        emiStartDate: "",
        emiFrequency: "monthly",
        notes: "",
      });
      fetchProjects();
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete "${projectName}"?\n\n` +
      `This will:\n` +
      `✓ Delete the project\n` +
      `✓ Delete all EMI schedules\n` +
      `❌ This action cannot be undone!\n\n` +
      `Note: Projects with payments cannot be deleted.`
    );

    if (!confirmDelete) return;

    setDeletingId(projectId);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/api/payments/admin/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Project deleted successfully!");
      fetchProjects(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string }> = {
      active: { label: "Active", class: "bg-green-100 text-green-800" },
      completed: { label: "Completed", class: "bg-blue-100 text-blue-800" },
      cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-800" },
      overdue: { label: "Overdue", class: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Project
        </button>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Create New Project Payment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-6">
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Client <span className="text-red-500">*</span>
                </label>
                
                {!showCreateClientForm ? (
                  <>
                    <select
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 bg-white"
                      style={{ color: '#111827' }}
                    >
                      <option value="" className="text-gray-500">-- Select Client --</option>
                      {users.length === 0 ? (
                        <option value="" disabled className="text-gray-400">No clients found</option>
                      ) : (
                        users.map((user) => (
                          <option key={user._id} value={user._id} className="text-gray-900">
                            {user.name} ({user.email})
                          </option>
                        ))
                      )}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => setShowCreateClientForm(true)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New Client
                    </button>
                  </>
                ) : (
                  <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Create New Client</h4>
                      <button
                        type="button"
                        onClick={() => setShowCreateClientForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={newClient.name}
                          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                          placeholder="Attar Yantra"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={newClient.email}
                          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                          placeholder="attar@example.com"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
                        <input
                          type="text"
                          value={newClient.password}
                          onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                          placeholder="password123"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                          placeholder="9876543210"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateClient}
                      disabled={creatingClient || !newClient.name || !newClient.email || !newClient.password}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {creatingClient ? "Creating Client..." : "Create Client Account"}
                    </button>
                    
                    <p className="text-xs text-gray-600 mt-2">
                      💡 Client credentials will be shown in a toast. Save them to share with the client.
                    </p>
                  </div>
                )}
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="E.g., E-commerce Website Development"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Brief description of the project..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Project Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.totalProjectAmount}
                    onChange={(e) => setFormData({ ...formData, totalProjectAmount: e.target.value })}
                    placeholder="25000"
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* EMI Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    EMI Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.emiAmount}
                    onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                    placeholder="2500"
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Number of EMIs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of EMIs <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfEmis}
                    onChange={(e) => setFormData({ ...formData, numberOfEmis: e.target.value })}
                    placeholder="10"
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* EMI Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    EMI Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.emiStartDate}
                    onChange={(e) => setFormData({ ...formData, emiStartDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* EMI Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EMI Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.emiFrequency}
                  onChange={(e) => setFormData({ ...formData, emiFrequency: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this project..."
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating Project..." : "Create Project & Generate EMIs"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.projectName}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  {project.projectDescription && (
                    <p className="text-sm text-gray-600 mb-2">
                      {project.projectDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Client: {project.userId?.name || "Unknown"}</span>
                    <span>•</span>
                    <span>{project.userId?.email || "N/A"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(project.totalProjectAmount)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Paid</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(project.totalPaidAmount)}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Remaining</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(project.remainingAmount)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">EMI Plan</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {project.numberOfEmis > 0
                      ? `${project.numberOfEmis} × ${formatCurrency(project.emiAmount)}`
                      : "No EMI"}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Payment Progress</span>
                  <span>
                    {((project.totalPaidAmount / project.totalProjectAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(project.totalPaidAmount / project.totalProjectAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(`/admin/projects/${project._id}`, "_blank")}
                  className="flex-1 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-all text-sm"
                >
                  View Details
                </button>
                
                <button
                  onClick={() => handleDeleteProject(project._id, project.projectName)}
                  disabled={deletingId === project._id || project.totalPaidAmount > 0}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title={project.totalPaidAmount > 0 ? "Cannot delete projects with payments" : "Delete project"}
                >
                  {deletingId === project._id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
