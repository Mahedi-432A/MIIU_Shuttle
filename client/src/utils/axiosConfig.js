import axios from "axios";
import { auth } from "../firebase/firebase.config";
import { getIdToken } from "firebase/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global Error Handler (Interceptors)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (!error.response) {
      // Network Error (Server Down / CORS / Wrong IP)
      alert("Network Error! Check if Server is running & IP is correct.\n\nDetails: " + error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
