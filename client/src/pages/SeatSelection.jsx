// import { useEffect, useState } from "react";
// import instance from "../utils/axiosConfig";
// import { useAuth } from "../constext/AuthContext";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { socket } from "../utils/socket";
// import { UserRound, ChevronLeft, ArrowRightLeft } from "lucide-react";

// export default function SeatSelection() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [seats, setSeats] = useState([]); // 
//   const [bookedSeats, setBookedSeats] = useState([]); 
//   const [selectedSeat, setSelectedSeat] = useState(null); 
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { bus, journeyInfo } = location.state || {};

//   // প্রোফাইল লোড
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await instance.get("/secure/profile");
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };
//     if (user) fetchProfile();
//   }, [user]);

//   // সিট লোড এবং সকেট লিসেনার
//   useEffect(() => {
//     if (!bus) return;

//     // মোট সিট তৈরি
//     setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));

//     // বুকড সিটগুলো লোড
//     const fetchBooked = async () => {
//       try {
//         const res = await instance.get(`/bookings/bus/${bus._id}`);
//         setBookedSeats(res.data);
//       } catch (error) {
//         console.error("Failed to fetch booked seats", error);
//         toast.error("Failed to load seats.");
//       }
//     };
//     fetchBooked();

//     // সকেট
//     socket.emit("joinBusRoom", bus._id);
//     socket.on("seatStatusUpdate", (data) => {
//       if (data.busId === bus._id) {
//         setBookedSeats((prev) => [...prev, data.seatNumber]);
//       }
//     });
//     socket.on("seatCancelledUpdate", (data) => {
//       if (data.busId === bus._id) {
//         setBookedSeats((prev) =>
//           prev.filter((seat) => seat !== data.seatNumber)
//         );
//       }
//     });

//     return () => {
//       socket.off("seatStatusUpdate");
//       socket.off("seatCancelledUpdate");
//     };
//   }, [bus]);

//   // বুকিং হ্যান্ডেল
//   const handleBooking = async () => {
//     if (!selectedSeat) return toast.error("Please select a seat");
//     try {
//       await instance.post("/bookings", {
//         busId: bus._id,
//         seatNumber: selectedSeat,
//         journeyFrom: journeyInfo.from,
//         journeyTo: journeyInfo.to,
//         journeyDate: journeyInfo.date,
//       });

//       toast.success("Seat booked!");
//       navigate("/booking-confirmed"); 
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Booking failed");
//     }
//   };

//   if (!bus || !journeyInfo) {
//     return (
//       <div className="p-6">
//         <p>No bus selected.</p>
//         <Link to="/home">Go back to Home</Link>
//       </div>
//     );
//   }

//   const availableSeatsLeft = (bus.totalSeats || 40) - bookedSeats.length;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       {/* হেডার */}
//       <header className="flex items-center justify-between mb-6">
//         <Link to="/available-buses" className="p-2">
//           <ChevronLeft size={24} />
//         </Link>
//         <h1 className="text-xl font-semibold">
//           Hello, {profile?.fullName.split(" ")[0] || "User"}!
//         </h1>
//         <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
//           <UserRound size={24} className="text-gray-500" />
//         </div>
//       </header>
//       <p className="mb-4 -mt-4 text-center text-gray-600">Choose your seat!</p>

//       {/* জার্নি ডিটেইলস কার্ড */}
//       <div className="p-5 mb-6 text-white bg-green-600 shadow-lg rounded-2xl">
//         <div className="mb-2 font-semibold text-center">Bus no: {bus.busName}</div>
//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold">{journeyInfo.from}</span>
//           <div className="flex items-center justify-center w-10 h-10 bg-gray-800 border-4 border-green-600 rounded-full">
//             <ArrowRightLeft size={20} className="text-white" />
//           </div>
//           <span className="text-2xl font-bold">{journeyInfo.to}</span>
//         </div>
//         <div className="pt-2 mt-4 text-center border-t border-green-500">
//           <span className="font-semibold">{journeyInfo.date}</span>
//         </div>
//       </div>

//       {/* সিট লেআউট ও লিজেন্ড */}
//       <div className="flex flex-col gap-6 md:flex-row">
//         {/* সিট লেআউট */}
//         <div className="w-full p-4 bg-white shadow rounded-2xl">
//           <div className="grid grid-cols-4 gap-3">
//             {seats.map((num) => {
//               const isBooked = bookedSeats.includes(num);
//               const isSelected = selectedSeat === num;
//               let seatClass = "bg-gray-200"; // Available
//               if (isBooked) seatClass = "bg-yellow-400"; // Booked
//               if (isSelected) seatClass = "bg-red-500"; // Your Seat

//               return (
//                 <button
//                   key={num}
//                   disabled={isBooked}
//                   onClick={() => setSelectedSeat(num)}
//                   className={`w-full h-12 rounded-lg ${seatClass} ${
//                     isBooked
//                       ? "cursor-not-allowed"
//                       : "cursor-pointer"
//                   } ${
//                     isSelected
//                       ? "ring-2 ring-red-700"
//                       : ""
//                   }`}
//                 >
//                   {/* {num} */}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* লিজেন্ড */}
//         <div className="w-full p-4 bg-white shadow md:w-1/3 rounded-2xl">
//           <ul className="space-y-3">
//             <li className="flex items-center">
//               <div className="w-5 h-5 mr-3 bg-yellow-400 rounded-full"></div>
//               <span>Booked</span>
//             </li>
//             <li className="flex items-center">
//               <div className="w-5 h-5 mr-3 bg-red-500 rounded-full"></div>
//               <span>Your Seat</span>
//             </li>
//             <li className="flex items-center">
//               <div className="w-5 h-5 mr-3 bg-gray-200 rounded-full"></div>
//               <span>Available</span>
//             </li>
//           </ul>
//           <div className="pt-4 mt-4 border-t">
//             <div className="px-4 py-2 font-bold text-center text-green-700 bg-green-100 rounded-lg">
//               {availableSeatsLeft} Seats left
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* কনফার্ম বাটন বা রিকুয়েস্ট বাটন */}
//       <div className="mt-8">
//         {availableSeatsLeft > 0 ? (
//           <button
//             onClick={handleBooking}
//             disabled={!selectedSeat}
//             className="w-full py-4 text-lg font-bold text-gray-900 bg-yellow-400 rounded-lg shadow disabled:opacity-50"
//           >
//             Confirm booking
//           </button>
//         ) : (
//           <div>
//             <p className="mb-4 font-semibold text-center text-red-600">
//               Sorry, no seats are available on this bus.
//             </p>
//             <button
//               disabled
//               className="w-full py-4 text-lg font-bold text-white bg-blue-500 rounded-lg shadow cursor-not-allowed opacity-70"
//             >
//               Request for Extra Bus
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ Link ইম্পোর্ট
import toast from "react-hot-toast";
import { socket } from "../utils/socket";
import { UserRound, ChevronLeft, ArrowRightLeft } from "lucide-react";

export default function SeatSelection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { bus, journeyInfo } = location.state || {};

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
    if (!bus) return;
    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
    const fetchBooked = async () => {
      try {
        const res = await instance.get(`/bookings/bus/${bus._id}`);
        setBookedSeats(res.data);
      } catch (error) {
        console.error("Failed to fetch booked seats", error);
        toast.error("Failed to load seats.");
      }
    };
    fetchBooked();
    socket.emit("joinBusRoom", bus._id);
    socket.on("seatStatusUpdate", (data) => {
      if (data.busId === bus._id) {
        setBookedSeats((prev) => [...prev, data.seatNumber]);
      }
    });
    socket.on("seatCancelledUpdate", (data) => {
      if (data.busId === bus._id) {
        setBookedSeats((prev) =>
          prev.filter((seat) => seat !== data.seatNumber)
        );
      }
    });
    return () => {
      socket.off("seatStatusUpdate");
      socket.off("seatCancelledUpdate");
    };
  }, [bus]);

  const handleBooking = async () => {
    if (!selectedSeat) return toast.error("Please select a seat");
    try {
      await instance.post("/bookings", {
        busId: bus._id,
        seatNumber: selectedSeat,
        journeyFrom: journeyInfo.from,
        journeyTo: journeyInfo.to,
        journeyDate: journeyInfo.date,
      });
      toast.success("Seat booked!");
      navigate("/booking-confirmed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (!bus || !journeyInfo) {
    return (
      <div className="min-h-screen p-6 bg-theme-bg">
        <p>No bus selected.</p>
        <Link to="/home">Go back to Home</Link>
      </div>
    );
  }

  const availableSeatsLeft = (bus.totalSeats || 40) - bookedSeats.length;

  return (
    <div className="min-h-screen p-6 bg-theme-bg">
      {/* হেডার */}
      <header className="flex items-center justify-between mb-6">
        <Link to="/available-buses" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">
          Hello, {profile?.fullName.split(" ")[0] || "User"}!
        </h1>
        {/* ✅ টপ-রাইট প্রোফাইল আইকনে লিঙ্ক যোগ করা হয়েছে */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
        >
          <UserRound size={24} className="text-gray-500" />
        </Link>
      </header>
      <p className="mb-4 -mt-4 text-center text-gray-600">Choose your seat!</p>

      {/* জার্নি ডিটেইলস কার্ড */}
      <div className="p-5 mb-6 text-white shadow-lg bg-theme-green rounded-2xl">
        <div className="mb-2 font-semibold text-center">Bus no: {bus.busName}</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{journeyInfo.from}</span>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-800 border-4 rounded-full border-theme-green">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold">{journeyInfo.to}</span>
        </div>
        <div className="pt-2 mt-4 text-center border-t border-green-500">
          <span className="font-semibold">{journeyInfo.date}</span>
        </div>
      </div>

      {/* সিট লেআউট ও লিজেন্ড */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* সিট লেআউট */}
        <div className="w-full p-4 bg-white shadow rounded-2xl">
          <div className="grid grid-cols-4 gap-3">
            {seats.map((num) => {
              const isBooked = bookedSeats.includes(num);
              const isSelected = selectedSeat === num;
              let seatClass = "bg-gray-200"; // Available
              if (isBooked) seatClass = "bg-yellow-400"; // Booked
              if (isSelected) seatClass = "bg-red-500"; // Your Seat
              return (
                <button
                  key={num}
                  disabled={isBooked}
                  onClick={() => setSelectedSeat(num)}
                  className={`w-full h-12 rounded-lg ${seatClass} ${
                    isBooked ? "cursor-not-allowed" : "cursor-pointer"
                  } ${isSelected ? "ring-2 ring-red-700" : ""}`}
                ></button>
              );
            })}
          </div>
        </div>
        {/* লিজেন্ড */}
        <div className="w-full p-4 bg-white shadow rounded-2xl">
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-5 h-5 mr-3 bg-yellow-400 rounded-full"></div>
              <span>Booked</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 mr-3 bg-red-500 rounded-full"></div>
              <span>Your Seat</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 mr-3 bg-gray-200 rounded-full"></div>
              <span>Available</span>
            </li>
          </ul>
          <div className="pt-4 mt-4 border-t">
            <div className="px-4 py-2 font-bold text-center text-green-700 bg-green-100 rounded-lg">
              {availableSeatsLeft} Seats left
            </div>
          </div>
        </div>
      </div>

      {/* কনফার্ম বাটন বা রিকুয়েস্ট বাটন */}
      <div className="mt-8">
        {availableSeatsLeft > 0 ? (
          <button
            onClick={handleBooking}
            disabled={!selectedSeat}
            className="w-full py-4 text-lg font-bold text-gray-900 rounded-lg shadow bg-theme-yellow disabled:opacity-50"
          >
            Confirm booking
          </button>
        ) : (
          <div>
            <p className="mb-4 font-semibold text-center text-red-600">
              Sorry, no seats are available on this bus.
            </p>
            <button
              disabled
              className="w-full py-4 text-lg font-bold text-white bg-blue-500 rounded-lg shadow cursor-not-allowed opacity-70"
            >
              Request for Extra Bus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}