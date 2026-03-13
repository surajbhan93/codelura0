"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("token");

      const { data } = await api.get("/admin/comments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComments(data);
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h2 className="font-bold mb-3">Comments</h2>

      {comments.map((c: any) => (
        <div key={c._id}>{c.comment}</div>
      ))}
    </div>
  );
}