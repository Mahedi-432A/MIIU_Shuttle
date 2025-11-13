import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../constext/AuthContext";
import { Bus } from "lucide-react"; // আপনার লোগোর বদলে আইকন

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // AuthContext থেকে ইউজার এবং লোডিং স্টেট
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // প্রথমবার ভিজিট চেক করুন
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      // এটি নতুন ইউজার
      localStorage.setItem("hasVisited", "true");
      setIsReturningUser(false);
    } else {
      // এটি পুরাতন ইউজার
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
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-md">
          <Bus size={80} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#f39c12]"> {/* Welcome to MIU Shuttle */}
          Welcome to SmartSeat
        </h1>
        <p className="text-gray-600 text-center mt-4">
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
              className="w-full bg-green-500 text-white py-3 rounded-full text-lg font-semibold shadow-lg mb-4"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/register")} // Create an account বাটন
              className="w-full text-green-600 py-2 rounded-full text-md"
            >
              Create an account
            </button>
          </>
        )}
      </div>
    </div>
  );
}