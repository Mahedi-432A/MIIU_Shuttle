// ... (imports) ...
import {
  UserRound,
  Contact,
  Mail,
  Phone,
  SunMoon,
  CalendarDays,
  PenSquare,
  ChevronRight,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../constext/AuthContext";
import instance from "../utils/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

// ... (ProfileItem and ToggleSwitch components - অপরিবর্তিত) ...
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center p-3 space-x-4 border-b">
    <div className="text-theme-green">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-base text-gray-900">{value}</div>
    </div>
  </div>
);
const ToggleSwitch = () => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" disabled />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
};


export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [totalRides, setTotalRides] = useState(0); // ✅ নতুন স্টেট
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        // দুটি এপিআই একসাথে কল করুন
        const [profileRes, historyRes] = await Promise.all([
          instance.get("/secure/profile"),
          instance.get("/bookings/history"), // ✅ হিস্ট্রি এপিআই
        ]);
        setProfile(profileRes.data);
        setTotalRides(historyRes.data.length); // ✅ মোট রাইড সেট করুন
      } catch (err) {
        console.error("Failed to fetch profile or history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user, authLoading]);

  // ... (getRoleSpecificId function - অপরিবর্তিত) ...
  const getRoleSpecificId = () => {
    if (!profile || !profile.role || !profile.roleSpecific) {
      return { label: "ID", value: "N/A" };
    }
    switch (profile.role) {
      case "Student":
        return { label: "Student ID", value: profile.roleSpecific.studentId || "N/A" };
      case "Faculty":
        return { label: "Faculty ID", value: profile.roleSpecific.facultyId || "N/A" };
      case "Stuff":
        return { label: "Stuff ID", value: profile.roleSpecific.stuffId || "N/A" };
      default:
        return { label: "ID", value: "N/A" };
    }
  };


  if (loading || authLoading) {
    // ... (লোডিং UI অপরিবর্তিত) ...
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user || !profile) {
    // ... (প্রোফাইল না থাকলে UI অপরিবর্তিত) ...
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Could not load profile.</p>
        <button onClick={logout} className="px-4 py-2 mt-4 text-white bg-red-500 rounded">
          Log Out
        </button>
      </div>
    );
  }
  
  const roleId = getRoleSpecificId();

  return (
    <div className="bg-[#5A7C6A] min-h-screen pb-24">
      {/* ... (ব্যাক বাটন, প্রোফাইল ছবি অপরিবর্তিত) ... */}
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-300 rounded-full">
          <UserRound size={80} className="text-gray-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg m-6 mt-[-40px] pt-12">
        {/* ... (Name, ID, Email, Mobile - অপরিবর্তিত) ... */}
        <ProfileItem icon={<UserRound size={24} />} label="Name" value={profile.fullName} />
        <ProfileItem icon={<Contact size={24} />} label={roleId.label} value={roleId.value} />
        <ProfileItem icon={<Mail size={24} />} label="Email" value={profile.email} />
        <ProfileItem icon={<Phone size={24} />} label="Mobile" value={profile.mobile} />
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-4">
            <div className="text-theme-green"><SunMoon size={24} /></div>
            <div><div className="text-base text-gray-900">Dark Mood</div></div>
          </div>
          <ToggleSwitch />
        </div>

        {/* ✅ "Total Rides" এখন ডাইনামিক */}
        <div className="flex items-center p-3 space-x-4 border-b">
          <div className="text-theme-green">
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="text-base text-gray-900">Total Rides: {totalRides}</div>
          </div>
        </div>

        {/* ... (Edit Profile বাটন অপরিবর্তিত) ... */}
        <button
          onClick={() => navigate("/edit-profile", { state: { profile } })}
          className="flex items-center justify-between w-full p-3"
        >
          <div className="flex items-center space-x-4">
            <div className="text-theme-green"><PenSquare size={24} /></div>
            <div className="text-base text-gray-900">Edit Profile</div>
          </div>
          <ChevronRight size={24} className="text-gray-400" />
        </button>
      </div>

      {/* ... (লগ আউট বাটন অপরিবর্তিত) ... */}
      <div className="px-6">
        <button
          onClick={logout}
          className="w-full py-3 font-semibold text-red-500 bg-white rounded-lg shadow"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}