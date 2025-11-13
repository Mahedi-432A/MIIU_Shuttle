import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ অ্যাডমিন স্টেট
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ইউজার লগইন করলে, তার টোকেন চেক করুন
        const tokenResult = await getIdTokenResult(currentUser);
        // টোকেন থেকে custom claim (admin) চেক করুন
        if (tokenResult.claims.admin === true) {
          setUser(currentUser);
          setIsAdmin(true);
        } else {
          // ইউজার লগইন করেছে, কিন্তু অ্যাডমিন নয়
          setUser(null);
          setIsAdmin(false);
          await signOut(auth); // তাকে সাইন আউট করে দিন
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);