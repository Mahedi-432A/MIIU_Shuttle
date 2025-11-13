import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Bus,
  MapPin,
  ArrowRightLeft,
  CalendarDays,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // সার্চ স্টেট
  const [from, setFrom] = useState("Campus");
  const [to, setTo] = useState("Mirpur");
  const [tripType, setTripType] = useState("Leave"); 
  const [date, setDate] = useState(getFormattedDate()); 

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
    return today
      .replace(",", " |")
      .replace(" Oct ", " - Oct - ")
      .replace(" 08 ", " 08th - "); 
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* হেডার: লোগো ও প্রোফাইল */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Bus size={32} className="text-green-600" />
          <span className="font-bold text-xl text-green-700">MIU SHUTTLE</span>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <UserRound size={24} className="text-gray-500" />
        </div>
      </header>

      {/* সার্চ কার্ড */}
      <div className="bg-green-600 rounded-2xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {profile?.fullName.split(" ")[0] || "User"}
        </h2>

        {/* ইনপুট ফিল্ড */}
        <div className="space-y-4 relative">
          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Boarding From"
              value={tripType === "Leave" ? "Campus" : from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={tripType === "Leave"}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900"
            />
          </div>
          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Where are you going?"
              value={tripType === "Leave" ? to : "Campus"}
              onChange={(e) => setTo(e.target.value)}
              disabled={tripType === "Arrive"}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900"
            />
          </div>
          {/* সোয়াপ বাটন */}
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-4 border-green-600">
            <ArrowRightLeft size={20} className="text-white" />
          </button>
        </div>

        {/* Arrive/Leave বাটন */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => setTripType("Arrive")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Arrive"
                ? "bg-white text-green-600"
                : "bg-green-700 text-white"
            }`}
          >
            Arrive
          </button>
          <button
            onClick={() => setTripType("Leave")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Leave"
                ? "bg-white text-green-600"
                : "bg-green-700 text-white"
            }`}
          >
            Leave
          </button>
        </div>

        {/* Find Buses বাটন */}
        <button
          onClick={handleFindBuses}
          className="w-full bg-yellow-400 text-gray-900 py-3 mt-6 rounded-lg text-lg font-bold shadow"
        >
          Find Buses
        </button>
      </div>

      {/* ডামি বাটন */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <button className="bg-green-100 text-green-800 p-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
          <Bus size={24} />
          <span>Request for Extra Bus</span>
        </button>
        <button className="bg-green-100 text-green-800 p-4 rounded-lg font-semibold">
          Track My Bus
        </button>
      </div>

      {/* অ্যানাউন্সমেন্ট */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          University Announcement
        </h3>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h4 className="font-bold text-green-700 mb-2">
            দৃষ্টি আকর্ষণ: ফ্যাকাল্টি গাড়ি আসাদগেট
          </h4>
          <p className="text-sm text-gray-600">
            আগামীকাল থেকে আসাদগেট রুটের ফ্যাকাল্টি গাড়িটি পূর্ব নির্ধারিত রুট
            অর্থাৎ মিরপুর এক নাম্বার, কল্যাণপুর ও কাঁচাবাজার হয়ে যাতায়াত করতে
            বলা হয়েছে।
          </p>
        </div>
      </div>
    </div>
  );
}