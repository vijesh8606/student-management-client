import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
// const API_BASE_URL = "http://localhost:2231/api";

// console.log(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((res) => res.data),
  register: (name, email, password, role) =>
    api
      .post("/auth/register", { name, email, password, role })
      .then((res) => res.data),
  getProfile: () => api.get("/auth/me").then((res) => res.data),
};

export const studentAPI = {
  getAll: () => api.get("/students").then((res) => res.data),
  getById: (id) => api.get(`/students/${id}`).then((res) => res.data),
  create: (data) => api.post("/students", data).then((res) => res.data),
  update: (id, data) =>
    api.put(`/students/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/students/${id}`).then((res) => res.data),
};

export default api;
