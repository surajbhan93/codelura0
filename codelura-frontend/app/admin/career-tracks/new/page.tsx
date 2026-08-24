"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import CareerTrackForm from "@/components/admin/CareerTrackForm";
import { CareerTrack, CareerTrackSingleResponse } from "@/components/admin/careerTrack";

export default function NewCareerTrackPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (payload: Partial<CareerTrack>) => {
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post<CareerTrackSingleResponse>(
        "/admin/career-tracks",
        payload
      );
      router.push(`/admin/career-tracks/${data.data._id}/edit`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to create career track."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">
        New career track
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        Fill in the details below to create a new career track.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CareerTrackForm
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Create career track"
      />
    </div>
  );
}