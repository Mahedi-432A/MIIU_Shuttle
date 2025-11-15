// import { createContext, useContext, useState, useEffect } from "react";
// import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase/firebase.config";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser){
//         const idToken = await getIdToken(currentUser);
//         setToken(idToken);
//       }
//       else {
//         setToken("");
//       }
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setToken("");
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";
import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import instance from "../utils/axiosConfig"; // ✅ Axios ইম্পোর্ট

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // ✅ আমাদের MongoDB প্রোফাইল
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await getIdToken(currentUser);
        setToken(idToken);
        setUser(currentUser);
        
        // ✅ ইউজার লগইন করলে, তার প্রোফাইল লোড করুন
        try {
          const res = await instance.get("/secure/profile", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          setProfile(res.data);
        } catch (err) {
          console.error("AuthContext: Failed to fetch profile", err);
          setProfile(null); // কোনো কারণে প্রোফাইল না পেলে null সেট করুন
        }
      } else {
        setToken("");
        setUser(null);
        setProfile(null); // ✅ লগআউট হলে প্রোফাইল ক্লিয়ার করুন
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null); // ✅ লগআউট হলে প্রোফাইল ক্লিয়ার করুন
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);