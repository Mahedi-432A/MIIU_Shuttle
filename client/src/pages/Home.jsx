import { useState, useEffect } from "react";
import { useAuth } from "../constext/AuthContext";
import instance from "../utils/axiosConfig";
import { useNavigate, Link } from "react-router-dom"; 
import {
  UserRound,
  Bus,
  MapPin,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";
import { socket } from "../utils/socket";

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [from, setFrom] = useState("Campus");
  const [to, setTo] = useState("Mirpur");
  const [tripType, setTripType] = useState("Leave");
  const [date, setDate] = useState(getFormattedDate());
  const [latestNotice, setLatestNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);

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

  useEffect(() => {
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
    socket.on("newNotice", (newNotice) => {
      setLatestNotice(newNotice);
    });
    return () => {
      socket.off("newNotice");
    };
  }, []);

  function getFormattedDate() {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    };
    const today = new Date().toLocaleDateString("en-GB", options);
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
    <div className="min-h-screen p-6 pb-24 bg-theme-bg">
      {/* হেডার: লোগো ও প্রোফাইল */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bus size={32} className="text-theme-green" />
          <span className="text-xl font-bold text-theme-green">MIU SHUTTLE</span>
        </div>
        {/* ✅ টপ-রাইট প্রোফাইল আইকনে লিঙ্ক যোগ করা হয়েছে */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
        >
          <UserRound size={24} className="text-gray-500" />
        </Link>
      </header>

      {/* সার্চ কার্ড */}
      <div className="p-6 text-white shadow-lg bg-theme-green rounded-2xl">
        <h2 className="mb-4 text-2xl font-semibold">
          Welcome, {profile?.fullName.split(" ")[0] || "User"}
        </h2>
        {/* ...বাকি ইনপুট ফিল্ড... */}
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
          <button className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-gray-800 border-4 rounded-full right-4 top-1/2 border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </button>
        </div>
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
        <button
          onClick={handleFindBuses}
          className="w-full py-3 mt-6 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow"
        >
          Find Buses
        </button>
      </div>

      {/* ডামি বাটন */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <button className="flex items-center justify-center p-4 space-x-2 font-semibold text-green-800 bg-green-100 rounded-lg">
          <Bus size={24} />
          <span>Request for Extra Bus</span>
        </button>
        <button className="p-4 font-semibold text-green-800 bg-green-100 rounded-lg">
          Track My Bus
        </button>
      </div>

      {/* অ্যানাউন্সমেন্ট */}
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          University Announcement
        </h3>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 min-h-[100px]">
          {loadingNotice ? (
            <div className="flex justify-center items-center h-[100px]">
              <Loader2 className="animate-spin text-theme-green" />
            </div>
          ) : latestNotice ? (
            <>
              <h4 className="mb-2 font-bold text-theme-green">
                {latestNotice.title}
              </h4>
              <p className="text-sm text-gray-600">{latestNotice.content}</p>
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