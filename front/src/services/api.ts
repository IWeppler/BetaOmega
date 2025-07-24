import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const apiClient = axios.create({
  baseURL: isProd ? "/api" : `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export default apiClient;
