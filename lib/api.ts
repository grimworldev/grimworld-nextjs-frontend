import axios from "axios";
import { config } from "process";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const PUBLIC_PATHS = ["/", "/login", "/register"];

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (!PUBLIC_PATHS.includes(window.location.pathname)) {
          window.location.href = "/login";
        }
      }
      return Promise.reject({
        status: error.response.status,
        ...error.response.data,
      });
    }
    return Promise.reject({ message: error.message });
  },
);

export default api;
