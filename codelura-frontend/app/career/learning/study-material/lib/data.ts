import { cache } from "react";
import { Course, Testimonial } from "../types";

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://api.codelura.com/api";
  return url.replace(/\/$/, "");
};

// Server-side cached fetch for Courses (Revalidated every 60s for freshness)
export const getCourses = cache(async (): Promise<Course[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/courses`, {
      next: { revalidate: 60, tags: ["courses"] },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`[getCourses] Failed HTTP ${res.status}: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.courses)) return data.courses;
    return [];
  } catch (error) {
    console.error("Error fetching courses on server:", error);
    return [];
  }
});

// Server-side cached fetch for Testimonials
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/testimonial/material`, {
      next: { revalidate: 300, tags: ["testimonials"] },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.testimonials)) return data.testimonials;
    return [];
  } catch (error) {
    console.error("Error fetching testimonials on server:", error);
    return [];
  }
});