"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import CareerTrackForm from "@/components/admin/CareerTrackForm";
import { CareerTrack, CareerTrackSingleResponse } from "@/components/admin/careerTrack";

export default function EditCareerTrackPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [track, setTrack] = useState<CareerTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    const fetchTrack = async () => {
      try {
        const { data } = await api.get<CareerTrackSingleResponse>(
          `/admin/career-tracks/${params.id}`
        );
        setTrack(data.data);
      } catch (err) {
        setError("Couldn't load this career track.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, [params?.id]);

  const handleUpdate = async (payload: Partial<CareerTrack>) => {
    setSubmitting(true);
    setError("");
    try {
      await api.put(`/admin/career-tracks/${params.id}`, payload);
      router.push("/admin/career-tracks");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to update career track."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-slate-400">
        Loading career track...
      </div>
    );
  }

  if (!track) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-red-600">
        {error || "Career track not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">
        Edit career track
      </h1>
      <p className="mb-8 text-sm text-slate-500">{track.title}</p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CareerTrackForm
        initialData={track}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
