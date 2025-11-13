import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⚠️ আপনার স্টুডেন্ট অ্যাপের .env ফাইল থেকে VITE_... ভ্যারিয়েবলগুলো কপি করুন
// অথবা সরাসরি এখানে পেস্ট করুন
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;