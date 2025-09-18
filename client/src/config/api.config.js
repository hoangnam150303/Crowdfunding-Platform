import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_TEMPLATE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // quan trọng: gửi cookie kèm request
});

export { axiosClient };
