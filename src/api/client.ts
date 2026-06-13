import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    const token = localStorage.getItem("lms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error(`[API Response Error]`, error);
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error || "Đã có lỗi xảy ra";

      if (status === 401) {
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
        window.location.href = "/login";
      } else if (status === 403) {
        toast.error("Không có quyền thực hiện: " + message);
      } else if (status === 400) {
        // Bad request - often validation errors
        // We let the hook/component handle this if they want to show specific field errors
      } else if (status >= 500) {
        toast.error("Lỗi hệ thống: " + message);
      }
    } else if (error.request) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
    } else {
      toast.error("Lỗi: " + error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
