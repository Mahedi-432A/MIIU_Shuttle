// ... imports ...
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
import logo from "../assets/icons and logo/logo.png";

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // ✅ সার্চ স্টেট আপডেটেড: এখন আমরা তারিখের অবজেক্ট সেভ করব
  const [from, setFrom] = useState("Campus");
  const [to, setTo] = useState("Destination");
  const [tripType, setTripType] = useState();
  const [searchDate, setSearchDate] = useState(new Date()); // ✅ আজকের তারিখ (অবজেক্ট)

  // ... (বাকি state এবং useEffect আগের মতোই) ...
  const [allRoutes, setAllRoutes] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [latestNotice, setLatestNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      try {
        const res = await instance.get("/buses/routes");
        setAllRoutes(res.data);
      } catch (err) { console.error("Failed to fetch routes", err); }
    };
    fetchAllRoutes();
  }, []);

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        const res = await instance.get("/notices/latest");
        setLatestNotice(res.data);
      } catch (err) { console.error("Failed to fetch latest notice", err); } 
      finally { setLoadingNotice(false); }
    };
    fetchLatestNotice();
    socket.on("newNotice", (newNotice) => { setLatestNotice(newNotice); });
    return () => { socket.off("newNotice"); };
  }, []);

  // ✅ তারিখ ফরম্যাট করার Helper ফাংশন (এখন অবজেক্ট নেয়)
  function getFormattedDate(dateObj) {
    const options = { day: "2-digit", month: "short", year: "numeric", weekday: "long" };
    const dateStr = dateObj.toLocaleDateString("en-GB", options);
    // ফরম্যাটিং (e.g., "15th - Nov - 2025 | Saturday")
    return dateStr.replace(",", " |").replace(/ (\w{3}) /g, " - $1 - ");
  }

  const handleFindBuses = () => {
    const searchParams = {
      from: tripType === "Leave" ? "Campus" : from.trim(),
      to: tripType === "Leave" ? to.trim() : "Campus",
      dateString: getFormattedDate(searchDate), // ✅ ডিসপ্লের জন্য স্ট্রিং
      dateObject: searchDate,                 // ✅ টাইমস্ট্যাম্পের জন্য অবজেক্ট
    };
    navigate("/available-buses", { state: searchParams });
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "Leave") {
      setFrom("Campus");
      setToSuggestions([]);
    } else {
      setTo("Campus");
      setFromSuggestions([]);
    }
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFrom(value);
    if (value.length > 0) {
      const suggestions = allRoutes.filter(route => 
        route.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(suggestions);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    if (value.length > 0) {
      const suggestions = allRoutes.filter(route => 
        route.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(suggestions);
    } else {
      setToSuggestions([]);
    }
  };
  
  return (
    <div className="min-h-screen p-6 pb-24 bg-theme-bg">
      {/* হেডার */}
      <header className="flex items-center justify-between mb-6">
        <div className="w-20 h-20">
          <img src={logo} alt="Logo" className="w-full" />
        </div>
        <Link to="/profile" className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          <UserRound size={32} className="text-gray-500" />
        </Link>
      </header>

      {/* সার্চ কার্ড */}
      <div className="p-6 text-white shadow-lg bg-[#63bd67] rounded-2xl">
        <h2 className="mb-4 text-2xl font-semibold">
          Welcome, {profile?.fullName.split(" ")[0] || "User"}
        </h2>

        <div className="relative space-y-4 hide-scrollbar">
          {/* Boarding From (✅ Autocomplete সহ) */}
          <div className="relative">
            <MapPin size={20} className="absolute text-white -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Boarding From"
              value={tripType === "Leave" ? "Campus" : from}
              onChange={handleFromChange}
              disabled={tripType === "Leave"}
              className="w-full py-3 pl-10 pr-4 text-white rounded-lg"
            />
            {fromSuggestions.length > 0 && tripType === "Arrive" && (
              <div className="absolute z-10 w-full overflow-y-auto bg-white rounded-b-lg shadow-lg max-h-40">
                {fromSuggestions.map(suggestion => (
                  <div
                    key={suggestion}
                    onClick={() => { setFrom(suggestion); setFromSuggestions([]); }}
                    className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Destination (✅ Autocomplete সহ) */}
          <div className="relative">
            <MapPin size={20} className="absolute text-white -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={tripType === "Leave" ? to : "Campus"}
              onChange={handleToChange}
              disabled={tripType === "Arrive"}
              className="w-full py-3 pl-10 pr-4 text-white rounded-lg"
            />
            {toSuggestions.length > 0 && tripType === "Leave" && (
              <div className="absolute z-10 w-full overflow-y-auto bg-white rounded-b-lg shadow-lg max-h-40">
                {toSuggestions.map(suggestion => (
                  <div
                    key={suggestion}
                    onClick={() => { setTo(suggestion); setToSuggestions([]); }}
                    className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-gray-800 border-4 rounded-full right-4 top-1/2 border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </button>
        </div>

        {/* Arrive/Leave বাটন */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => handleTripTypeChange("Arrive")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Arrive" ? "bg-[#d0e9ea] text-[#3c3c43b3]" : "bg-green-700 text-white"
            }`}
          >
            Arrive
          </button>
          <button
            onClick={() => handleTripTypeChange("Leave")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Leave" ? "bg-[#d0e9ea] text-[#3c3c43b3]" : "bg-green-700 text-white"
            }`}
          >
            Leave
          </button>
        </div>

        <button
          onClick={handleFindBuses}
          className="w-full py-3 mt-6 text-lg font-bold text-gray-900 bg-[#facc15] rounded-lg shadow"
        >
          Find Buses
        </button>
      </div>
      
      {/* ...বাকি ডামি বাটন ও অ্যানাউন্সমেন্ট (আগের মতোই)... */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <button className="flex items-center justify-center p-4 space-x-2 font-semibold text-green-800 bg-green-100 rounded-lg">
          <Bus size={24} />
          <span>Request for Extra Bus</span>
        </button>
        <button className="p-4 font-semibold text-green-800 bg-green-100 rounded-lg">
          Track My Bus
        </button>
      </div>
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
              <h4 className="mb-2 font-bold text-theme-green">{latestNotice.title}</h4>
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
