// import { useState, useEffect } from "react";
// import { useAuth } from "../constext/AuthContext";
// import instance from "../utils/axiosConfig"; // ✅ Axios instance
// import { useNavigate } from "react-router-dom";
// import { ChevronRight, Bus, MapPin, Loader2 } from "lucide-react"; // ✅ Loader icon

// // লোগো ইমেজ ()
// const logo = "https://i.imgur.com/sC4s0is.png";

// export default function Home() {
//   const { user, profile } = useAuth(); 
//   const navigate = useNavigate();

//   // সার্চ স্টেট
//   const [boardingFrom, setBoardingFrom] = useState("");
//   const [destination, setDestination] = useState("");
//   const [tripType, setTripType] = useState("Arrive"); // Arrive or Leave

//   // ✅ নোটিশ স্টেট
//   const [latestNotice, setLatestNotice] = useState(null);
//   const [loadingNotice, setLoadingNotice] = useState(true);

//   // ✅ সর্বশেষ নোটিশ লোড করুন
//   useEffect(() => {
//     const fetchLatestNotice = async () => {
//       try {
//         const res = await instance.get("/notices/latest");
//         setLatestNotice(res.data);
//       } catch (err) {
//         console.error("Failed to fetch latest notice", err);
//       } finally {
//         setLoadingNotice(false);
//       }
//     };
//     fetchLatestNotice();
//   }, []);

//   // ফাইন্ড বাস
//   const handleFindBuses = () => {
//     navigate("/available-buses", {
//       state: { boardingFrom, destination, tripType, date: new Date() },
//     });
//   };

//   return (
//     <div className="min-h-screen pb-24 bg-theme-bg"> {/* ন্যাভবারের জন্য প্যাডিং */}
//       {/* হেডার */}
//       <header className="flex items-center justify-between p-6">
//         <img src={logo} alt="MIU Shuttle Logo" className="h-10" />
//         <div 
//           onClick={() => navigate('/profile')} 
//           className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full cursor-pointer"
//         >
//           {/* এখানে প্রোফাইল ছবি দেখানো যেতে পারে */}
//           <span className="font-bold text-gray-600">
//             {profile?.fullName?.charAt(0) || user?.email?.charAt(0)}
//           </span>
//         </div>
//       </header>

//       {/* ওয়েলকাম মেসেজ */}
//       <div className="px-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Welcome, {profile?.fullName ? profile.fullName.split(" ")[0] : ""}!
//         </h1>
//       </div>

//       {/* বাস সার্চ বক্স */}
//       <div className="p-6 m-6 bg-white shadow-lg rounded-2xl">
//         <div className="relative">
//           <input
//             type="text"
//             value={boardingFrom}
//             onChange={(e) => setBoardingFrom(e.target.value)}
//             placeholder="Boarding From"
//             className="w-full p-4 pl-10 bg-gray-100 rounded-lg"
//           />
//           <MapPin className="absolute text-gray-400 left-3 top-4" size={20} />
//           <input
//             type="text"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//             placeholder="Where are you going?"
//             className="w-full p-4 pl-10 mt-3 bg-gray-100 rounded-lg"
//           />
//           <MapPin className="absolute left-3 top-[76px] text-gray-400" size={20} />
//         </div>

//         {/* Arrive/Leave বাটন */}
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={() => setTripType("Arrive")}
//             className={`w-full p-3 rounded-lg font-semibold ${
//               tripType === "Arrive"
//                 ? "bg-theme-green text-white"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Arrive
//           </button>
//           <button
//             onClick={() => setTripType("Leave")}
//             className={`w-full p-3 rounded-lg font-semibold ${
//               tripType === "Leave"
//                 ? "bg-theme-green text-white"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Leave
//           </button>
//         </div>

//         <button
//           onClick={handleFindBuses}
//           className="w-full p-4 mt-4 text-lg font-bold text-gray-900 rounded-lg bg-theme-yellow"
//         >
//           Find Buses
//         </button>
//       </div>

//       {/* অন্যান্য বাটন */}
//       <div className="grid grid-cols-2 gap-4 px-6">
//         <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
//           <Bus size={30} className="mb-2 text-theme-green" />
//           <span className="font-semibold text-gray-800">Request for Extra Bus</span>
//         </button>
//         <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
//           <MapPin size={30} className="mb-2 text-theme-green" />
//           <span className="font-semibold text-gray-800">Track My Bus</span>
//         </button>
//       </div>

//       {/* University Announcement Section (✅ ডাইনামিক) */}
//       <div className="px-6 mt-6">
//         <h2 className="mb-3 text-xl font-semibold text-gray-800">
//           University Announcement
//         </h2>
//         <div className="bg-white rounded-lg shadow p-4 border border-gray-100 min-h-[100px]">
//           {loadingNotice ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader2 className="animate-spin text-theme-green" />
//             </div>
//           ) : latestNotice ? (
//             <>
//               <h3 className="mb-2 text-lg font-bold text-theme-green">
//                 {latestNotice.title}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 {latestNotice.content}
//               </p>
//               <small className="block mt-2 text-gray-400">
//                 {new Date(latestNotice.createdAt).toLocaleString()}
//               </small>
//             </>
//           ) : (
//             <p className="pt-4 text-center text-gray-500">No recent announcements.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useAuth } from "../constext/AuthContext";
import instance from "../utils/axiosConfig"; // ✅ Axios instance
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Bus,
  MapPin,
  ArrowRightLeft,
  CalendarDays,
  Loader2, // ✅ Loader icon
} from "lucide-react";
import { socket } from "../utils/socket"; // ✅ Socket.io ইম্পোর্ট

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // সার্চ স্টেট
  const [from, setFrom] = useState("Campus");
  const [to, setTo] = useState("Mirpur"); // Default 'To'
  const [tripType, setTripType] = useState("Leave"); // Arrive বা Leave
  const [date, setDate] = useState(getFormattedDate()); // আজকের তারিখ

  // ✅ নোটিশ স্টেট
  const [latestNotice, setLatestNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);

  // প্রোফাইল লোড
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await instance.get("/secure/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  // ✅ সর্বশেষ নোটিশ লোড করুন এবং সকেট লিসেন করুন
  useEffect(() => {
    // ১. প্রথমবার লোড করুন
    const fetchLatestNotice = async () => {
      try {
        const res = await instance.get("/notices/latest");
        setLatestNotice(res.data);
      } catch (err) {
        console.error("Failed to fetch latest notice", err);
      } finally {
        setLoadingNotice(false);
      }
    };
    fetchLatestNotice();

    // ২. নতুন নোটিশের জন্য সকেট লিসেনার সেট করুন
    socket.on("newNotice", (newNotice) => {
      console.log("New notice received via socket:", newNotice);
      setLatestNotice(newNotice); // স্টেট আপডেট করুন
    });

    // ৩. কম্পোনেন্ট আনমাউন্ট হলে লিসেনার ক্লিন আপ করুন
    return () => {
      socket.off("newNotice");
    };
  }, []); // এই useEffect একবারই রান হবে

  // তারিখ ফরম্যাট করার Helper ফাংশন
  function getFormattedDate() {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    };
    // 08th - Oct - 2025 | Sunday
    const today = new Date().toLocaleDateString("en-GB", options);
    // "08 Oct 2025, Sunday" -> "08th - Oct - 2025 | Sunday"
    // একটি ডেমো ফরম্যাটিং
    return today
      .replace(",", " |")
      .replace(" Oct ", " - Oct - ")
      .replace(" 08 ", " 08th - "); // এটি আরও ভালো করা যেত, কিন্তু ডেমোর জন্য চলবে
  }

  const handleFindBuses = () => {
    navigate("/available-buses", {
      state: {
        from: tripType === "Leave" ? "Campus" : from,
        to: tripType === "Leave" ? to : "Campus",
        date: date,
      },
    });
  };

  return (
    <div className="min-h-screen p-6 pb-24 bg-theme-bg"> {/* ✅ কালার থিম আপডেট */}
      {/* হেডার: লোগো ও প্রোফাইল */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bus size={32} className="text-theme-green" />
          <span className="text-xl font-bold text-theme-green">MIU SHUTTLE</span>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
          <UserRound size={24} className="text-gray-500" />
        </div>
      </header>

      {/* সার্চ কার্ড */}
      <div className="p-6 text-white shadow-lg bg-theme-green rounded-2xl"> {/* ✅ কালার থিম */}
        <h2 className="mb-4 text-2xl font-semibold">
          Welcome, {profile?.fullName.split(" ")[0] || "User"}
        </h2>

        {/* ইনপুট ফিল্ড */}
        <div className="relative space-y-4">
          <div className="relative">
            <MapPin
              size={20}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />
            <input
              type="text"
              placeholder="Boarding From"
              value={tripType === "Leave" ? "Campus" : from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={tripType === "Leave"}
              className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
            />
          </div>
          <div className="relative">
            <MapPin
              size={20}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />
            <input
              type="text"
              placeholder="Where are you going?"
              value={tripType === "Leave" ? to : "Campus"}
              onChange={(e) => setTo(e.target.value)}
              disabled={tripType === "Arrive"}
              className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
            />
          </div>
          {/* সোয়াপ বাটন */}
          <button className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-gray-800 border-4 rounded-full right-4 top-1/2 border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </button>
        </div>

        {/* Arrive/Leave বাটন */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => setTripType("Arrive")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Arrive"
                ? "bg-white text-theme-green"
                : "bg-green-700 text-white"
            }`}
          >
            Arrive
          </button>
          <button
            onClick={() => setTripType("Leave")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Leave"
                ? "bg-white text-theme-green"
                : "bg-green-700 text-white"
            }`}
          >
            Leave
          </button>
        </div>

        {/* Find Buses বাটন */}
        <button
          onClick={handleFindBuses}
          className="w-full py-3 mt-6 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow"
        >
          Find Buses
        </button>
      </div>

      {/* ডামি বাটন */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <button className="flex items-center justify-center p-4 space-x-2 font-semibold text-green-800 bg-green-100 rounded-lg"> {/* ✅ কালার থিম */}
          <Bus size={24} />
          <span>Request for Extra Bus</span>
        </button>
        <button className="p-4 font-semibold text-green-800 bg-green-100 rounded-lg"> {/* ✅ কালার থিম */}
          Track My Bus
        </button>
      </div>

      {/* অ্যানাউন্সমেন্ট */}
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          University Announcement
        </h3>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 min-h-[100px]">
          {/* ✅ ডাইনামিক সেকশন */}
          {loadingNotice ? (
            <div className="flex justify-center items-center h-[100px]">
              <Loader2 className="animate-spin text-theme-green" />
            </div>
          ) : latestNotice ? (
            <>
              <h4 className="mb-2 font-bold text-theme-green">
                {latestNotice.title}
              </h4>
              <p className="text-sm text-gray-600">
                {latestNotice.content}
              </p>
              <small className="block mt-2 text-gray-400">
                {new Date(latestNotice.createdAt).toLocaleString()}
              </small>
            </>
          ) : (
            <p className="pt-8 text-center text-gray-500">
              No recent announcements.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}