import { createContext, useContext, useState, useEffect } from "react";
import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import instance from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // ✅ প্রোফাইল ফেচ করার ফাংশন (যাতে আমরা বাইরে থেকেও কল করতে পারি)
  const fetchUserProfile = async (currentUser) => {
    try {
      const idToken = await getIdToken(currentUser);
      setToken(idToken);
      
      const res = await instance.get("/secure/profile", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setProfile(res.data);
    } catch (err) {
      // ✅ ফিক্স: যদি 404 হয় (মানে প্রোফাইল এখনো তৈরি হয়নি), তবে এরর দেখাবে না
      if (err.response && err.response.status === 404) {
        console.log("User profile not found in DB yet (Normal during registration).");
        setProfile(null);
      } else {
        console.error("AuthContext: Failed to fetch profile", err);
        setProfile(null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // লগইন করার সাথে সাথে প্রোফাইল আনার চেষ্টা করুন
        await fetchUserProfile(currentUser);
      } else {
        setToken("");
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setToken("");
  };

  return (
    // ✅ fetchUserProfile কে ভ্যালু হিসেবে পাঠাচ্ছি
    <AuthContext.Provider value={{ user, profile, token, logout, loading, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);