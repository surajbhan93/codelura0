"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface Settings {
  _id: string;
  upiNumber: string;
  qrCodeUrl: string | null;
  isActive: boolean;
  updatedAt: string;
  updatedBy?: {
    name: string;
    email: string;
  };
}

export default function PaymentSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [upiNumber, setUpiNumber] = useState("");
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/payment-settings/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data.settings);
      setUpiNumber(response.data.settings.upiNumber);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpiUpdate = async () => {
    if (!upiNumber.trim()) {
      toast.error("UPI number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(upiNumber)) {
      toast.error("Invalid UPI/mobile number. Must be 10 digits.");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/payment-settings/admin/upi`,
        { upiNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("UPI number updated successfully");
      fetchSettings();
    } catch (error: any) {
      console.error("Error updating UPI:", error);
      toast.error(error.response?.data?.message || "Failed to update UPI number");
    } finally {
      setUpdating(false);
    }
  };

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = async () => {
    if (!qrFile) {
      toast.error("Please select a QR code image");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("qrCode", qrFile);

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/payment-settings/admin/qr-code`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("QR code uploaded successfully");
      setQrFile(null);
      setQrPreview(null);
      fetchSettings();
    } catch (error: any) {
      console.error("Error uploading QR:", error);
      toast.error(error.response?.data?.message || "Failed to upload QR code");
    } finally {
      setUpdating(false);
    }
  };

  const handleQrDelete = async () => {
    if (!confirm("Are you sure you want to delete the QR code?")) {
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/payment-settings/admin/qr-code`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("QR code deleted successfully");
      fetchSettings();
    } catch (error: any) {
      console.error("Error deleting QR:", error);
      toast.error(error.response?.data?.message || "Failed to delete QR code");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* UPI Number Section */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">UPI / Mobile Number</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            UPI Number (10 digits)
          </label>
          <input
            type="text"
            value={upiNumber}
            onChange={(e) => setUpiNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9336289192"
            maxLength={10}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-mono text-lg"
          />
        </div>

        <button
          onClick={handleUpiUpdate}
          disabled={updating || upiNumber === settings?.upiNumber}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {updating ? "Updating..." : "Update UPI Number"}
        </button>

        {settings?.updatedBy && (
          <p className="mt-3 text-xs text-gray-500">
            Last updated by {settings.updatedBy.name} on{" "}
            {new Date(settings.updatedAt).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Payment QR Code</h3>

        {settings?.qrCodeUrl && !qrPreview && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Current QR Code</p>
            <div className="inline-block">
              <Image
                src={settings.qrCodeUrl}
                alt="Current Payment QR Code"
                width={300}
                height={300}
                className="rounded-lg border-2 border-gray-200"
              />
            </div>
            <button
              onClick={handleQrDelete}
              disabled={updating}
              className="block mt-3 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all"
            >
              Delete QR Code
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {settings?.qrCodeUrl ? "Upload New QR Code" : "Upload QR Code"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleQrFileChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {qrPreview && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Preview</p>
            <Image
              src={qrPreview}
              alt="QR Preview"
              width={300}
              height={300}
              className="rounded-lg border-2 border-gray-200"
            />
          </div>
        )}

        <button
          onClick={handleQrUpload}
          disabled={updating || !qrFile}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {updating ? "Uploading..." : "Upload QR Code"}
        </button>

        <p className="mt-3 text-xs text-gray-500">
          The QR code will be displayed to clients during payment
        </p>
      </div>
    </div>
  );
}
