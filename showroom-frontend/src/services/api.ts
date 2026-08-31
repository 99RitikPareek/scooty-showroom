import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const customerToken = localStorage.getItem("customer_token");

    const token = adminToken && adminToken !== "null" && adminToken !== "undefined"
      ? adminToken
      : customerToken && customerToken !== "null" && customerToken !== "undefined"
      ? customerToken
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
        if (typeof config.headers.unset === "function") {
          config.headers.unset("Content-Type");
          config.headers.unset("content-type");
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (
        window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.startsWith("/admin/login")
      ) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
        window.location.href = "/admin/login?expired=true";
      } else if (
        window.location.pathname.startsWith("/service") ||
        window.location.pathname.startsWith("/account")
      ) {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_user");
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
