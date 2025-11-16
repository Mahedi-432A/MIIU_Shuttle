import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserRound, ChevronLeft, ArrowRightLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import BusIcon from "../assets/icons and logo/Bus image.png"

export default function AvailableBuses() {
  const { profile } = useAuth();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ সার্চ স্টেট আপডেটেড
  const searchState = location.state || {
    from: "Campus",
    to: "Route",
    dateString: "Today",
    dateObject: new Date(), // ডিফল্ট আজকের তারিখ
  };

  useEffect(() => {
    // ... (fetchBuses function is the same as previous step) ...
    const fetchBuses = async () => {
      if (!searchState.from || !searchState.to) {
        toast.error("Please select 'From' and 'To' locations.");
        setLoading(false);
        return;
      }
      try {
        const res = await instance.get("/buses", {
          params: {
            from: searchState.from,
            to: searchState.to,
          },
        });
        setBuses(res.data);
      } catch (err) {
        console.error("Error loading buses:", err);
        toast.error("Failed to find buses for this route.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [searchState.from, searchState.to]);

  // ... (isBusDisabled function is the same as previous step) ...
  const isBusDisabled = (bus) => {
    if (!profile) return true;
    const userRole = profile.role;
    const userGender = profile.gender;
    const busType = bus.busType;
    if (userRole === "Student" && busType === "Faculty") {
      return true;
    }
    if (userRole === "Student") {
      if (userGender === "Male" && busType === "Female") return true;
      if (userGender === "Female" && busType === "Male") return true;
    }
    return false;
  };


  const handleConfirm = () => {
    if (!selectedBus) {
      toast.error("Please select a bus");
      return;
    }
    navigate("/seat-selection", {
      state: {
        bus: selectedBus,
        journeyInfo: searchState, // ✅ সম্পূর্ণ journeyInfo (dateObject সহ) পাস করুন
      },
    });
  };

  return (
    <div className="min-h-screen p-6 pb-24 bg-theme-bg">
      {/* ... (হেডার অপরিবর্তিত) ... */}
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="z-20 p-2 bg-white rounded-full shadow-lg">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">
          Hello {profile?.fullName.split(" ")[0] || "User"}!
        </h1>
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
        >
          <UserRound size={24} className="text-gray-500" />
        </Link>
      </header>
      <p className="mb-4 -mt-4 text-center text-gray-600">Select your bus!</p>

      {/* জার্নি ডিটেইলস কার্ড (✅ আপডেটেড) */}
      <div className="p-5 mb-6 text-white bg-green-400 shadow-lg rounded-2xl">
        <div className="mx-auto mb-3 w-28">
          <img className="w-full" src={BusIcon} alt="Bus Icon" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{searchState.from}</span>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-800 border-4 rounded-full border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold">{searchState.to}</span>
        </div>
        <div className="pt-2 mt-4 text-center border-t border-green-500">
          {/* ✅ dateString (ফরম্যাটেড স্ট্রিং) ব্যবহার করুন */}
          <span className="font-semibold">{searchState.dateString}</span>
        </div>
      </div>

      {/* ... (বাকি বাস লিস্ট এবং বাটন অপরিবর্তিত) ... */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="animate-spin text-theme-green" size={40} />
        </div>
      ) : buses.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          No buses available for this route at this time.
        </p>
      ) : (
        <div className="space-y-4">
          {buses.map((bus, index) => {
            const isDisabled = isBusDisabled(bus);
            const isSelected = selectedBus?._id === bus._id;
            return (
              <button
                key={bus._id}
                onClick={() => !isDisabled && setSelectedBus(bus)}
                disabled={isDisabled}
                className={`flex items-center w-full p-4 bg-white rounded-lg shadow border-2
                  ${isSelected ? "border-theme-green" : "border-transparent"}
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-2xl font-bold text-white bg-green-400 rounded-lg">
                  {index + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">{bus.busType} Bus</h3>
                  <p className="text-sm text-gray-600">
                    Bus Name: {bus.busName}
                  </p>
                  <p className="text-sm text-gray-600">
                     Driver: {bus.driverName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Contact: {bus.driverContact}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 ml-auto bg-gray-800 rounded-full">
                  <UserRound size={24} className="text-white" />
                </div>
              </button>
            );
          })}
        </div>
      )}
      {buses.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedBus}
            className="w-full py-4 text-lg font-bold text-gray-900 rounded-lg shadow bg-[#facc15] disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}