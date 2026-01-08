import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: '/api', // Vite proxy forwards /api to http://localhost:5000/api
});

// Request interceptor: Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Extract error message from various possible structures
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login
    }

    // Reject with a consistent error structure
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
    });
  }
);

export default axiosInstance;
