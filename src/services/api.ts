import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5213/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies if we use them later
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.warn("Unauthorized access - redirecting to login");
      // window.location.href = '/login'; // Uncomment when auth flow is ready
    }
    return Promise.reject(error);
  }
);

export default api;
