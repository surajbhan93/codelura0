
import axios from "axios";
// import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⭐ COOKIE SEND KARNE KE LIYE
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Interceptor: NO redirect, only logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn(
        "401 from API:",
        err.config?.url,
        err.response?.data
      );
    }
    return Promise.reject(err);
  }
);
export default api;