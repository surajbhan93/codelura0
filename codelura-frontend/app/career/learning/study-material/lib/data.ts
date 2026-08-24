import { cache } from "react";
import { Course, Testimonial } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

// Server-side cached fetch for Courses (Revalidated every 5 mins)
export const getCourses = cache(async (): Promise<Course[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      next: { revalidate: 300, tags: ["courses"] },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching courses on server:", error);
    return [];
  }
});

// Server-side cached fetch for Testimonials
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonial/material`, {
      next: { revalidate: 300, tags: ["testimonials"] },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching testimonials on server:", error);
    return [];
  }
});