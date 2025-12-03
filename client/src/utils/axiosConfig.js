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

export default instance;
