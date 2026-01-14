import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/icons and logo/logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // first time visitor check
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      // for new user
      localStorage.setItem("hasVisited", "true");
      setIsReturningUser(false);
    } else {
      setIsReturningUser(true);
    }
  }, []);

  useEffect(() => {
    // শুধুমাত্র পুরাতন ইউজারদের জন্য এই লজিক কাজ করবে
    if (isReturningUser && !loading) {
      // ২ সেকেন্ড অপেক্ষা করুন
      const timer = setTimeout(() => {
        if (user) {
          navigate("/home"); // লগইন করা থাকলে হোম-এ পাঠান
        } else {
          navigate("/login"); // লগইন করা না থাকলে লগইন-এ পাঠান
        }
      }, 2000); // ২ সেকেন্ড (২০০০ মিলিসেকেন্ড)

      return () => clearTimeout(timer); // কম্পোনেন্ট আনমাউন্ট হলে টাইমার ক্লিয়ার করুন
    }
  }, [isReturningUser, loading, user, navigate]);

  return (
    // আপনার স্ক্রিনশটের ডিজাইন
    <div className="flex flex-col h-screen justify-between p-8 bg-[#fcf8f0]">
      {/* উপরের খালি অংশ */}
      <div></div>

      {/* মাঝের কন্টেন্ট */}
      <div className="flex flex-col items-center">
        {/* লোগো (আপনার দেয়া ছবির বদলে আইকন ব্যবহার করছি) */}
        <div className="flex items-center justify-center w-40 h-40 mb-6 shadow-md rounded-4xl">
          <img src={logo} alt="Logo" className="w-full" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#f39c12]"> {/* Welcome to MIU Shuttle */}
          Welcome to MIU Shuttle
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Your hassle-free bus seat booking solution! Easily reserve your seat
          anytime, anywhere with just a few taps.
        </p>
      </div>

      {/* বাটন (শুধুমাত্র নতুন ইউজাররা দেখবে) */}
      <div className="mb-6">
        {!isReturningUser && (
          <>
            <button
              onClick={() => navigate("/login")} // Get Started বাটন
              className="w-full py-3 mb-4 text-lg font-semibold text-white bg-green-500 rounded-full shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/register")} // Create an account বাটন
              className="w-full py-2 text-green-600 rounded-full text-md"
            >
              Create an account
            </button>
          </>
        )}
      </div>
    </div>
  );
}
