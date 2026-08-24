import axios from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

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