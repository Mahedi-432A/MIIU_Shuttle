
// import { useEffect, useState } from "react";
// import instance from "../utils/axiosConfig";
// import { useAuth } from "../constext/AuthContext";
// import { useLocation, useNavigate, Link } from "react-router-dom"; // ✅ Link ইম্পোর্ট
// import { UserRound, ChevronLeft, Bus, ArrowRightLeft } from "lucide-react";
// import toast from "react-hot-toast";

// export default function AvailableBuses() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [buses, setBuses] = useState([]);
//   const [selectedBus, setSelectedBus] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const searchState = location.state || {
//     from: "Campus",
//     to: "Route",
//     date: "Today",
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await instance.get("/secure/profile");
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };
//     const fetchBuses = async () => {
//       try {
//         const res = await instance.get("/buses");
//         setBuses(res.data);
//       } catch (err) {
//         console.error("Error loading buses:", err);
//       }
//     };
//     if (user) fetchProfile();
//     fetchBuses();
//   }, [user]);

//   const isBusDisabled = (busType) => {
//     if (!profile) return true;
//     const userGender = profile.gender;
//     if (userGender === "Male" && busType === "Female") return true;
//     if (userGender === "Female" && busType === "Male") return true;
//     return false;
//   };

//   const handleConfirm = () => {
//     if (!selectedBus) {
//       toast.error("Please select a bus");
//       return;
//     }
//     navigate("/seat-selection", {
//       state: {
//         bus: selectedBus,
//         journeyInfo: searchState,
//       },
//     });
//   };

//   return (
//     <div className="min-h-screen p-6 bg-theme-bg">
//       {/* হেডার */}
//       <header className="flex items-center justify-between mb-6">
//         <Link to="/home" className="p-2">
//           <ChevronLeft size={24} />
//         </Link>
//         <h1 className="text-xl font-semibold">
//           Hello {profile?.fullName.split(" ")[0] || "User"}!
//         </h1>
//         {/* ✅ টপ-রাইট প্রোফাইল আইকনে লিঙ্ক যোগ করা হয়েছে */}
//         <Link
//           to="/profile"
//           className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
//         >
//           <UserRound size={24} className="text-gray-500" />
//         </Link>
//       </header>
//       <p className="mb-4 -mt-4 text-center text-gray-600">Select your bus!</p>

//       {/* জার্নি ডিটেইলস কার্ড */}
//       <div className="p-5 mb-6 text-white shadow-lg bg-theme-green rounded-2xl">
//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold">{searchState.from}</span>
//           <div className="flex items-center justify-center w-10 h-10 bg-gray-800 border-4 rounded-full border-theme-green">
//             <ArrowRightLeft size={20} className="text-white" />
//           </div>
//           <span className="text-2xl font-bold">{searchState.to}</span>
//         </div>
//         <div className="pt-2 mt-4 text-center border-t border-green-500">
//           <span className="font-semibold">{searchState.date}</span>
//         </div>
//       </div>

//       {/* বাস লিস্ট */}
//       <div className="space-y-4">
//         {buses.map((bus, index) => {
//           const isDisabled = isBusDisabled(bus.busType);
//           const isSelected = selectedBus?._id === bus._id;
//           return (
//             <button
//               key={bus._id}
//               onClick={() => !isDisabled && setSelectedBus(bus)}
//               disabled={isDisabled}
//               className={`flex items-center w-full p-4 bg-white rounded-lg shadow border-2
//                 ${isSelected ? "border-theme-green" : "border-transparent"}
//                 ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//               `}
//             >
//               <div className="flex items-center justify-center w-12 h-12 mr-4 text-2xl font-bold text-white rounded-lg bg-theme-green">
//                 {index + 1}
//               </div>
//               <div className="text-left">
//                 <h3 className="text-lg font-bold">{bus.busType} Bus</h3>
//                 <p className="text-sm text-gray-600">
//                   Bus No: {bus.busName} | Driver: {bus.driverName}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Contact: {bus.driverContact}
//                 </p>
//               </div>
//               <div className="flex items-center justify-center w-12 h-12 ml-auto bg-gray-800 rounded-full">
//                 <UserRound size={24} className="text-white" />
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* কনফার্ম বাটন */}
//       <div className="mt-8">
//         <button
//           onClick={handleConfirm}
//           disabled={!selectedBus}
//           className="w-full py-4 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow disabled:opacity-50"
//         >
//           Confirm
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext"; // ✅ AuthContext ইম্পোর্ট
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserRound, ChevronLeft, ArrowRightLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AvailableBuses() {
  const { profile } = useAuth(); // ✅ প্রোফাইল এখন Context থেকে আসছে
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ লোডিং স্টেট
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // হোম পেজ থেকে পাঠানো সার্চ ডাটা
  const searchState = location.state || {
    from: "Campus",
    to: "Route",
    date: "Today",
  };

  // ✅ বাস খোঁজার লজিক (আপডেটেড)
  useEffect(() => {
    const fetchBuses = async () => {
      if (!searchState.from || !searchState.to) {
        toast.error("Please select 'From' and 'To' locations.");
        setLoading(false);
        return;
      }
      try {
        // নতুন 'findBuses' এপিআই কল করুন
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
  }, [searchState.from, searchState.to]); // রুট পরিবর্তন হলে আবার বাস খুঁজবে

  // ✅ নতুন বুকিং রুলস অনুযায়ী বাস নিষ্ক্রিয় করার লজিক
  const isBusDisabled = (bus) => {
    if (!profile) return true; // প্রোফাইল লোড না হলে নিষ্ক্রিয়

    const userRole = profile.role;
    const userGender = profile.gender;
    const busType = bus.busType;

    // রুল ১: স্টুডেন্টরা ফ্যাকাল্টি বাসে উঠতে পারবে না
    if (userRole === "Student" && busType === "Faculty") {
      return true;
    }

    // রুল ২: জেন্ডার রুলস (স্টুডেন্টদের জন্য)
    if (userRole === "Student") {
      if (userGender === "Male" && busType === "Female") return true;
      if (userGender === "Female" && busType === "Male") return true;
    }
    
    // ফ্যাকাল্টি ও স্টাফরা সব বাসে উঠতে পারবে (সিট সিলেকশনে গিয়ে রুল প্রযোজ্য হবে)
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
        journeyInfo: searchState,
      },
    });
  };

  return (
    <div className="min-h-screen p-6 pb-24 bg-theme-bg">
      {/* হেডার */}
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2">
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

      {/* জার্নি ডিটেইলস কার্ড */}
      <div className="p-5 mb-6 text-white shadow-lg bg-theme-green rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{searchState.from}</span>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-800 border-4 rounded-full border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold">{searchState.to}</span>
        </div>
        <div className="pt-2 mt-4 text-center border-t border-green-500">
          <span className="font-semibold">{searchState.date}</span>
        </div>
      </div>

      {/* বাস লিস্ট (✅ আপডেটেড) */}
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
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-2xl font-bold text-white rounded-lg bg-theme-green">
                  {index + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">{bus.busType} Bus</h3>
                  <p className="text-sm text-gray-600">
                    Bus No: {bus.busName} | Driver: {bus.driverName}
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

      {/* কনফার্ম বাটন */}
      {buses.length > 0 && (
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedBus}
            className="w-full py-4 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}