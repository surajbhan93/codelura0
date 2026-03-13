"use client";

import { useState } from "react";
import api from "@/lib/api";

type Testimonial = {
  _id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  category: string;
  isApproved: boolean;
  createdAt: string;
};

type EditModalProps = {
  testimonial: Testimonial;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditModal({
  testimonial,
  onClose,
  onUpdated,
}: EditModalProps) {
  const [message, setMessage] = useState<string>(testimonial.message);
  const [rating, setRating] = useState<number>(testimonial.rating);
  const [category, setCategory] = useState<string>(testimonial.category);

  const update = async () => {
    await api.put(`/testimonial/update/${testimonial._id}`, {
      message,
      rating,
      category,
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-[400px]">
        <h2 className="text-xl mb-4">Edit Testimonial</h2>

        <textarea
          className="w-full p-2 bg-gray-800 rounded mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="number"
          min={1}
          max={5}
          className="w-full p-2 bg-gray-800 rounded mb-3"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <select
          className="w-full p-2 bg-gray-800 rounded mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="webservice">Web Service</option>
          <option value="material">Material</option>
          <option value="referral">Referral</option>
          <option value="jobs">Jobs</option>
          <option value="membership">Membership</option>
          <option value="hackathon">Hackathon</option>
          <option value="general">General</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={update}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}