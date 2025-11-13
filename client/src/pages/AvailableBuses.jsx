import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserRound, ChevronLeft, Bus, ArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AvailableBuses() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // হোম পেজ থেকে পাঠানো সার্চ ডাটা
  const searchState = location.state || {
    from: "Campus",
    to: "Route",
    date: "Today",
  };

  // প্রোফাইল (জেন্ডারের জন্য) ও বাস লিস্ট লোড
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await instance.get("/secure/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    const fetchBuses = async () => {
      try {
        const res = await instance.get("/buses");
        setBuses(res.data);
      } catch (err) {
        console.error("Error loading buses:", err);
      }
    };
    if (user) fetchProfile();
    fetchBuses();
  }, [user]);

  // বাস সিলেকশন বাটন চেক করার লজিক
  const isBusDisabled = (busType) => {
    if (!profile) return true; // প্রোফাইল লোড না হলে নিষ্ক্রিয়
    const userGender = profile.gender;

    if (userGender === "Male" && busType === "Female") {
      return true; // পুরুষরা মহিলাদের বাসে উঠতে পারবে না
    }
    if (userGender === "Female" && busType === "Male") {
      return true; // মহিলারা পুরুষদের বাসে উঠতে পারবে না
    }
    return false; // বাকি সব বাস (Combined, Faculty) সবাই পারবে
  };

  // কনফার্ম বাটন ক্লিক
  const handleConfirm = () => {
    if (!selectedBus) {
      toast.error("Please select a bus");
      return;
    }
    navigate("/seat-selection", {
      state: {
        bus: selectedBus,
        journeyInfo: searchState, // সিট পেজেও জার্নির তথ্য পাঠান
      },
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* হেডার */}
      <header className="flex justify-between items-center mb-6">
        <Link to="/home" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">
          Hello {profile?.fullName.split(" ")[0] || "User"}!
        </h1>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <UserRound size={24} className="text-gray-500" />
        </div>
      </header>
      <p className="text-center text-gray-600 mb-4 -mt-4">Select your bus!</p>

      {/* জার্নি ডিটেইলস কার্ড */}
      <div className="bg-green-600 rounded-2xl p-5 shadow-lg text-white mb-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{searchState.from}</span>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-4 border-green-600">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold">{searchState.to}</span>
        </div>
        <div className="text-center mt-4 border-t border-green-500 pt-2">
          <span className="font-semibold">{searchState.date}</span>
        </div>
      </div>

      {/* বাস লিস্ট */}
      <div className="space-y-4">
        {buses.map((bus, index) => {
          const isDisabled = isBusDisabled(bus.busType);
          const isSelected = selectedBus?._id === bus._id;

          return (
            <button
              key={bus._id}
              onClick={() => !isDisabled && setSelectedBus(bus)}
              disabled={isDisabled}
              className={`flex items-center w-full p-4 bg-white rounded-lg shadow border-2
                ${
                  isSelected
                    ? "border-green-600"
                    : "border-transparent"
                }
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold mr-4">
                {index + 1}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">{bus.busType} Bus</h3>
                <p className="text-sm text-gray-600">
                  Bus No: {bus.busName} | Driver: {bus.driverName}
                </p>
                <p className="text-sm text-gray-500">
                  Contact: {bus.driverContact}
                </p>
              </div>
              <div className="ml-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <UserRound size={24} className="text-white" />
              </div>
            </button>
          );
        })}
      </div>

      {/* কনফার্ম বাটন */}
      <div className="mt-8">
        <button
          onClick={handleConfirm}
          disabled={!selectedBus}
          className="w-full bg-yellow-400 text-gray-900 py-4 rounded-lg text-lg font-bold shadow disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}