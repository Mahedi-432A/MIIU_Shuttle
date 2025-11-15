// import { useState, useEffect } from "react";
// import { useAuth } from "../constext/AuthContext";
// import instance from "../utils/axiosConfig";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   UserRound,
//   Bus,
//   MapPin,
//   ArrowRightLeft,
//   Loader2,
// } from "lucide-react";
// import { socket } from "../utils/socket";

// export default function Home() {
//   const { profile } = useAuth(); // ✅ প্রোফাইল এখন Context থেকে আসছে
//   const navigate = useNavigate();

//   // ✅ সার্চ স্টেট আপডেটেড
//   const [from, setFrom] = useState("Campus");
//   const [to, setTo] = useState("Mirpur 1"); // একটি ডিফল্ট গন্তব্য
//   const [tripType, setTripType] = useState("Leave"); // Arrive or Leave
//   const [date, setDate] = useState(getFormattedDate());

//   const [latestNotice, setLatestNotice] = useState(null);
//   const [loadingNotice, setLoadingNotice] = useState(true);

//   // ✅ প্রোফাইল আর এখানে fetch করার দরকার নেই

//   // নোটিশ লোড
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
//     socket.on("newNotice", (newNotice) => {
//       setLatestNotice(newNotice);
//     });
//     return () => {
//       socket.off("newNotice");
//     };
//   }, []);

//   function getFormattedDate() {
//     const options = {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       weekday: "long",
//     };
//     const today = new Date().toLocaleDateString("en-GB", options);
//     return today
//       .replace(",", " |")
//       .replace(" Oct ", " - Oct - ")
//       .replace(" 08 ", " 08th - ");
//   }

//   // ✅ ফাইন্ড বাস লজিক (আপডেটেড)
//   const handleFindBuses = () => {
//     // tripType অনুযায়ী 'from' এবং 'to' সেট করুন
//     const searchParams = {
//       from: tripType === "Leave" ? "Campus" : to, // Leave হলে Campus থেকে শুরু
//       to: tripType === "Leave" ? to : "Campus",   // Arrive হলে Campus-এ শেষ
//       date: date,
//     };
//     navigate("/available-buses", { state: searchParams });
//   };

//   // ✅ Arrive/Leave বাটন হ্যান্ডেলার
//   const handleTripTypeChange = (type) => {
//     setTripType(type);
//     // ইনপুট ফিল্ডগুলো অটো-সুইচ করুন
//     if (type === "Leave") {
//       setFrom("Campus");
//       // 'to' ফিল্ডটি খালি রাখা যেতে পারে অথবা আগের ভ্যালু রাখা যেতে পারে
//       // setTo("Mirpur 1"); 
//     } else {
//       setTo("Campus");
//       // 'from' ফিল্ডটি খালি রাখা যেতে পারে
//       // setFrom("Mirpur 1");
//     }
//   };


//   return (
//     <div className="min-h-screen p-6 pb-24 bg-theme-bg">
//       {/* হেডার */}
//       <header className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <Bus size={32} className="text-theme-green" />
//           <span className="text-xl font-bold text-theme-green">MIU SHUTTLE</span>
//         </div>
//         <Link
//           to="/profile"
//           className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
//         >
//           <UserRound size={24} className="text-gray-500" />
//         </Link>
//       </header>

//       {/* সার্চ কার্ড (✅ আপডেটেড) */}
//       <div className="p-6 text-white shadow-lg bg-theme-green rounded-2xl">
//         <h2 className="mb-4 text-2xl font-semibold">
//           Welcome, {profile?.fullName.split(" ")[0] || "User"}
//         </h2>

//         <div className="relative space-y-4">
//           <div className="relative">
//             <MapPin
//               size={20}
//               className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
//             />
//             {/* Boarding From */}
//             <input
//               type="text"
//               placeholder="Boarding From"
//               value={tripType === "Leave" ? "Campus" : from}
//               onChange={(e) => setFrom(e.target.value)}
//               disabled={tripType === "Leave"}
//               className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
//             />
//           </div>
//           <div className="relative">
//             <MapPin
//               size={20}
//               className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
//             />
//             {/* Destination */}
//             <input
//               type="text"
//               placeholder="Where are you going?"
//               value={tripType === "Leave" ? to : "Campus"}
//               onChange={(e) => setTo(e.target.value)}
//               disabled={tripType === "Arrive"}
//               className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
//             />
//           </div>
//           {/* সোয়াপ বাটন (এখনও ডামি) */}
//           <button className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-gray-800 border-4 rounded-full right-4 top-1/2 border-theme-green">
//             <ArrowRightLeft size={20} className="text-white" />
//           </button>
//         </div>

//         {/* Arrive/Leave বাটন (✅ আপডেটেড) */}
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <button
//             onClick={() => handleTripTypeChange("Arrive")}
//             className={`py-3 rounded-lg font-semibold ${
//               tripType === "Arrive"
//                 ? "bg-white text-theme-green"
//                 : "bg-green-700 text-white"
//             }`}
//           >
//             Arrive
//           </button>
//           <button
//             onClick={() => handleTripTypeChange("Leave")}
//             className={`py-3 rounded-lg font-semibold ${
//               tripType === "Leave"
//                 ? "bg-white text-theme-green"
//                 : "bg-green-700 text-white"
//             }`}
//           >
//             Leave
//           </button>
//         </div>

//         <button
//           onClick={handleFindBuses}
//           className="w-full py-3 mt-6 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow"
//         >
//           Find Buses
//         </button>
//       </div>
      
//       {/* ...বাকি ডামি বাটন ও অ্যানাউন্সমেন্ট (আগের মতোই)... */}
//       <div className="grid grid-cols-2 gap-4 my-6">
//         <button className="flex items-center justify-center p-4 space-x-2 font-semibold text-green-800 bg-green-100 rounded-lg">
//           <Bus size={24} />
//           <span>Request for Extra Bus</span>
//         </button>
//         <button className="p-4 font-semibold text-green-800 bg-green-100 rounded-lg">
//           Track My Bus
//         </button>
//       </div>
//       <div>
//         <h3 className="mb-3 text-xl font-semibold text-gray-800">
//           University Announcement
//         </h3>
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200 min-h-[100px]">
//           {loadingNotice ? (
//             <div className="flex justify-center items-center h-[100px]">
//               <Loader2 className="animate-spin text-theme-green" />
//             </div>
//           ) : latestNotice ? (
//             <>
//               <h4 className="mb-2 font-bold text-theme-green">
//                 {latestNotice.title}
//               </h4>
//               <p className="text-sm text-gray-600">{latestNotice.content}</p>
//               <small className="block mt-2 text-gray-400">
//                 {new Date(latestNotice.createdAt).toLocaleString()}
//               </small>
//             </>
//           ) : (
//             <p className="pt-8 text-center text-gray-500">
//               No recent announcements.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
  const { profile } = useAuth();
  const navigate = useNavigate();

  // সার্চ স্টেট
  const [from, setFrom] = useState("Campus");
  const [to, setTo] = useState("Mirpur 1");
  const [tripType, setTripType] = useState("Leave");
  const [date, setDate] = useState(getFormattedDate());
  
  // ✅ নতুন স্টেট: Autocomplete
  const [allRoutes, setAllRoutes] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [latestNotice, setLatestNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);

  // ✅ নতুন: Autocomplete-এর জন্য রুট লোড করুন
  useEffect(() => {
    const fetchAllRoutes = async () => {
      try {
        const res = await instance.get("/buses/routes");
        setAllRoutes(res.data);
      } catch (err) {
        console.error("Failed to fetch routes", err);
      }
    };
    fetchAllRoutes();
  }, []);

  // নোটিশ লোড (আগের মতোই)
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
    const options = { day: "2-digit", month: "short", year: "numeric", weekday: "long" };
    const today = new Date().toLocaleDateString("en-GB", options);
    return today.replace(",", " |").replace(" Oct ", " - Oct - ").replace(" 08 ", " 08th - ");
  }

  const handleFindBuses = () => {
    const searchParams = {
      from: tripType === "Leave" ? "Campus" : from,
      to: tripType === "Leave" ? to : "Campus",
      date: date,
    };
    navigate("/available-buses", { state: searchParams });
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "Leave") {
      setFrom("Campus");
      setToSuggestions([]); // সাজেশন বক্স হাইড করুন
    } else {
      setTo("Campus");
      setFromSuggestions([]); // সাজেশন বক্স হাইড করুন
    }
  };

  // ✅ নতুন: "From" ইনপুট হ্যান্ডেল (Autocomplete)
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

  // ✅ নতুন: "To" ইনপুট হ্যান্ডেল (Autocomplete)
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
      {/* ...হেডার... */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bus size={32} className="text-theme-green" />
          <span className="text-xl font-bold text-theme-green">MIU SHUTTLE</span>
        </div>
        <Link to="/profile" className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
          <UserRound size={24} className="text-gray-500" />
        </Link>
      </header>

      {/* সার্চ কার্ড */}
      <div className="p-6 text-white shadow-lg bg-theme-green rounded-2xl">
        <h2 className="mb-4 text-2xl font-semibold">
          Welcome, {profile?.fullName.split(" ")[0] || "User"}
        </h2>

        <div className="relative space-y-4">
          {/* Boarding From (✅ Autocomplete সহ) */}
          <div className="relative">
            <MapPin size={20} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Boarding From"
              value={tripType === "Leave" ? "Campus" : from}
              onChange={handleFromChange}
              disabled={tripType === "Leave"}
              className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
            />
            {/* সাজেশন বক্স (From) */}
            {fromSuggestions.length > 0 && tripType === "Arrive" && (
              <div className="absolute z-10 w-full overflow-y-auto bg-white rounded-b-lg shadow-lg max-h-40">
                {fromSuggestions.map(suggestion => (
                  <div
                    key={suggestion}
                    onClick={() => {
                      setFrom(suggestion);
                      setFromSuggestions([]);
                    }}
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
            <MapPin size={20} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={tripType === "Leave" ? to : "Campus"}
              onChange={handleToChange}
              disabled={tripType === "Arrive"}
              className="w-full py-3 pl-10 pr-4 text-gray-900 rounded-lg"
            />
            {/* সাজেশন বক্স (To) */}
            {toSuggestions.length > 0 && tripType === "Leave" && (
              <div className="absolute z-10 w-full overflow-y-auto bg-white rounded-b-lg shadow-lg max-h-40">
                {toSuggestions.map(suggestion => (
                  <div
                    key={suggestion}
                    onClick={() => {
                      setTo(suggestion);
                      setToSuggestions([]);
                    }}
                    className="p-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* ...সোয়াপ বাটন... */}
          <button className="absolute flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-gray-800 border-4 rounded-full right-4 top-1/2 border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </button>
        </div>

        {/* Arrive/Leave বাটন */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => handleTripTypeChange("Arrive")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Arrive" ? "bg-white text-theme-green" : "bg-green-700 text-white"
            }`}
          >
            Arrive
          </button>
          <button
            onClick={() => handleTripTypeChange("Leave")}
            className={`py-3 rounded-lg font-semibold ${
              tripType === "Leave" ? "bg-white text-theme-green" : "bg-green-700 text-white"
            }`}
          >
            Leave
          </button>
        </div>

        {/* ...বাকি কোড (Find Buses, ডামি বাটন, অ্যানাউন্সমেন্ট)... */}
        <button
          onClick={handleFindBuses}
          className="w-full py-3 mt-6 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow"
        >
          Find Buses
        </button>
      </div>
      
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