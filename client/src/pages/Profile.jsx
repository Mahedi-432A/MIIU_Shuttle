// // src/pages/Profile.jsx
// import { useEffect, useState } from "react";
// import { useAuth } from "../constext/AuthContext";
// import instance from "../utils/axiosConfig";
// import { useNavigate } from "react-router-dom";
// import {
//   UserRound,
//   Contact,
//   Mail,
//   Phone,
//   SunMoon,
//   CalendarDays,
//   PenSquare,
//   ChevronRight,
//   Loader2,
// } from "lucide-react"; // আইকন ইম্পোর্ট

// // ছোট একটি Helper Component
// const ProfileItem = ({ icon, label, value }) => (
//   <div className="flex items-center p-3 space-x-4 border-b">
//     <div className="text-blue-600">{icon}</div>
//     <div>
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="text-base text-gray-900">{value}</div>
//     </div>
//   </div>
// );

// // Toggle Switch Component (স্ক্রিনশটের জন্য)
// const ToggleSwitch = () => {
//   return (
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input type="checkbox" value="" className="sr-only peer" disabled />
//       <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//     </label>
//   );
// };

// export default function Profile() {
//   const { user, logout, loading: authLoading } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (authLoading) return; // Firebase Auth লোড হওয়ার জন্য অপেক্ষা
//     if (!user) {
//       setLoading(false);
//       return; // ইউজার লগইন না করলে কিছু করবেনা
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await instance.get("/secure/profile");
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//         if (err.response?.status === 404) {
//           // যদি প্রোফাইল 404 হয়, সম্ভবত রেজিস্ট্রেশনের পর ডিটেইলস সেভ হয়নি
//           // আপনি ইউজারকে এডিট পেজে পাঠাতে পারেন বা এরর দেখাতে পারেন
//           console.log("Profile details not found.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [user, authLoading]);

//   if (loading || authLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="animate-spin" size={40} />
//       </div>
//     );
//   }

//   if (!user || !profile) {
//     return (
//       <div className="p-6 text-center">
//         <p className="text-gray-600">Could not load profile.</p>
//         <button
//           onClick={logout}
//           className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
//         >
//           Log Out
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#5A7C6A] min-h-screen">
//       {/* উপরের ব্যাক বাটন */}
//       <div className="p-4">
//         <button
//           onClick={() => navigate(-1)} // এক পেজ পেছনে যায়
//           className="p-2 bg-white rounded-full shadow"
//         >
//           <ChevronRight className="transform rotate-180" />
//         </button>
//       </div>

//       {/* প্রোফাইল ছবি */}
//       <div className="flex justify-center">
//         <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-300 rounded-full">
//           <UserRound size={80} className="text-gray-500" />
//         </div>
//       </div>

//       {/* ইনফো বক্স */}
//       <div className="pt-12 m-6 -mt-10 bg-white rounded-lg shadow-lg">
//         <ProfileItem
//           icon={<UserRound size={24} />}
//           label="Name"
//           value={profile.fullName}
//         />
//         <ProfileItem
//           icon={<Contact size={24} />}
//           label="Student ID"
//           value={profile.studentId || "N/A"}
//         />
//         <ProfileItem
//           icon={<Mail size={24} />}
//           label="Email"
//           value={profile.email}
//         />
//         <ProfileItem
//           icon={<Phone size={24} />}
//           label="Mobile"
//           value={profile.mobile}
//         />

//         {/* ডার্ক মোড (নন-ফাংশনাল) */}
//         <div className="flex items-center justify-between p-3 border-b">
//           <div className="flex items-center space-x-4">
//             <div className="text-blue-600">
//               <SunMoon size={24} />
//             </div>
//             <div>
//               <div className="text-base text-gray-900">Dark Mood</div>
//             </div>
//           </div>
//           <ToggleSwitch />
//         </div>

//         {/* টোটাল রাইড (নন-ফাংশনাল) */}
//         <div className="flex items-center p-3 space-x-4 border-b">
//           <div className="text-blue-600">
//             <CalendarDays size={24} />
//           </div>
//           <div>
//             <div className="text-base text-gray-900">Total Rides: 04</div>
//           </div>
//         </div>

//         {/* এডিট প্রোফাইল */}
//         <button
//           onClick={() => navigate("/edit-profile", { state: { profile } })}
//           className="flex items-center justify-between w-full p-3"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="text-blue-600">
//               <PenSquare size={24} />
//             </div>
//             <div className="text-base text-gray-900">Edit Profile</div>
//           </div>
//           <ChevronRight size={24} className="text-gray-400" />
//         </button>
//       </div>

//       {/* লগ আউট বাটন */}
//       <div className="px-6">
//         <button
//           onClick={logout}
//           className="w-full py-3 font-semibold text-red-500 bg-white rounded-lg shadow"
//         >
//           Log Out
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useAuth } from "../constext/AuthContext";
import instance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
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
  ChevronLeft, // ✅ ব্যাক বাটন
} from "lucide-react";

// ... ProfileItem and ToggleSwitch components (আগের মতোই) ...
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await instance.get("/secure/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Could not load profile.</p>
        <button
          onClick={logout}
          className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    // ✅ ন্যাভবার ফিক্স: pb-24 যোগ করা হয়েছে
    <div className="bg-[#5A7C6A] min-h-screen pb-24">
      {/* উপরের ব্যাক বাটন */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)} // এক পেজ পেছনে যায়
          className="p-2 bg-white rounded-full shadow"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* প্রোফাইল ছবি */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-300 rounded-full">
          <UserRound size={80} className="text-gray-500" />
        </div>
      </div>

      {/* ইনফো বক্স */}
      <div className="bg-white rounded-lg shadow-lg m-6 mt-[-40px] pt-12">
        <ProfileItem
          icon={<UserRound size={24} />}
          label="Name"
          value={profile.fullName}
        />
        <ProfileItem
          icon={<Contact size={24} />}
          label="Student ID"
          value={profile.studentId || "N/A"}
        />
        <ProfileItem
          icon={<Mail size={24} />}
          label="Email"
          value={profile.email}
        />
        <ProfileItem
          icon={<Phone size={24} />}
          label="Mobile"
          value={profile.mobile}
        />
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-4">
            <div className="text-theme-green">
              <SunMoon size={24} />
            </div>
            <div>
              <div className="text-base text-gray-900">Dark Mood</div>
            </div>
          </div>
          <ToggleSwitch />
        </div>
        <div className="flex items-center p-3 space-x-4 border-b">
          <div className="text-theme-green">
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="text-base text-gray-900">Total Rides: 04</div>
          </div>
        </div>
        <button
          onClick={() => navigate("/edit-profile", { state: { profile } })}
          className="flex items-center justify-between w-full p-3"
        >
          <div className="flex items-center space-x-4">
            <div className="text-theme-green">
              <PenSquare size={24} />
            </div>
            <div className="text-base text-gray-900">Edit Profile</div>
          </div>
          <ChevronRight size={24} className="text-gray-400" />
        </button>
      </div>

      {/* লগ আউট বাটন */}
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