// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../constext/AuthContext";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"], // optional: polling বাদ দিয়ে সরাসরি websocket
// });

// export default function SeatSelection() {
//   const { token, user } = useAuth();
//   const [seats, setSeats] = useState([]);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const bus = location.state?.bus;

//   // ✅ Load booked seats from API
//   useEffect(() => {
//     if (!bus) return;
//     const fetchBooked = async () => {
//       const res = await axios.get("http://localhost:5000/api/bookings", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const taken = res.data
//         .filter((b) => b.busId._id === bus._id)
//         .map((b) => b.seatNumber);
//       setBookedSeats(taken);
//     };
//     // ৪০ সিট ধরা হলো
//     setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
//     fetchBooked();
//   }, [bus]);

//   // ✅ Realtime update listener
//   useEffect(() => {
//     socket.on("seatStatusUpdate", (data) => {
//       if (data.busId === bus._id) {
//         setBookedSeats((prev) =>
//           prev.includes(data.seatNumber) ? prev : [...prev, data.seatNumber]
//         );
//       }
//       console.log("Received update:", data);
//     });

//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
//     });
    
//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     return () => socket.off("seatStatusUpdate");
//   }, [bus]);

//   // ✅ Booking function
//   const handleBooking = async () => {
//     if (!selectedSeat) return toast.error("Please select a seat");
//     try {
//       await axios.post(
//         "http://localhost:5000/api/bookings",
//         { busId: bus._id, seatNumber: selectedSeat },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // ✅ Emit socket event after successful booking
//       socket.emit("seatBooked", {
//         busId: bus._id,
//         seatNumber: selectedSeat,
//         bookedBy: user?.email || "unknown",
//       });

//       toast.success("Seat booked!");
//       navigate("/profile");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Booking failed");
//     }
//   };

//   if (!bus)
//     return <p className="p-6 text-gray-500">No bus selected. Go back.</p>;

//   if (!user)
//     return (
//       <p className="p-6 text-red-500">
//         Please{" "}
//         <Link className="text-shadow-black" to="/login">
//           login
//         </Link>{" "}
//         to book a seat.
//       </p>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">
//         Choose Your Seat — {bus.busName}
//       </h1>

//       <div className="grid grid-cols-4 gap-2 w-64 mb-6">
//         {seats.map((num) => {
//           const isBooked = bookedSeats.includes(num);
//           const isSelected = num === selectedSeat;
//           return (
//             <button
//               key={num}
//               onClick={() => !isBooked && setSelectedSeat(num)}
//               className={`p-3 border rounded ${
//                 isBooked
//                   ? "bg-red-400 cursor-not-allowed"
//                   : isSelected
//                   ? "bg-green-500 text-white"
//                   : "bg-gray-100 hover:bg-green-100"
//               }`}
//             >
//               {num}
//             </button>
//           );
//         })}
//       </div>

//       <button
//         onClick={handleBooking}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Confirm Booking
//       </button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../constext/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function SeatSelection() {
  const { token, user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus;

  // ✅ Load booked seats from API (আপডেট করা হয়েছে)
  useEffect(() => {
    if (!bus || !token) return;

    const fetchBooked = async () => {
      try {
        // ⭐️ পরিবর্তন: নির্দিষ্ট বাসের সব বুকিং আনুন
        const res = await axios.get(
          `http://localhost:5000/api/bookings/bus/${bus._id}`, // ⭐️ এই URL পরিবর্তন হয়েছে
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // সার্ভার এখন সরাসরি সিট নম্বরের একটি অ্যারে পাঠাচ্ছে (যেমন: [5, 10, 12])
        setBookedSeats(res.data); // ⭐️ ফিল্টারিং এর আর দরকার নেই
        
      } catch (error) {
        console.error("Failed to fetch booked seats", error);
        toast.error("Failed to load seats. Please try again.");
      }
    };

    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
    fetchBooked();
  }, [bus, token]);

  // ✅ Realtime update listener + Room Join (এই কোড ঠিক আছে)
  useEffect(() => {
    if (!bus) return;

    socket.emit("joinBusRoom", bus._id);
    console.log(`Attempting to join room: ${bus._id}`);

    // লিসেনার: যখন কোনো সিট বুক হয়
    socket.on("seatStatusUpdate", (data) => {
      if (data.busId === bus._id) {
        setBookedSeats((prev) =>
          prev.includes(data.seatNumber) ? prev : [...prev, data.seatNumber]
        );
      }
      console.log("Received update (Booked):", data);
    });

    // লিসেনার: যখন কোনো সিট ক্যানসেল হয়
    socket.on("seatCancelledUpdate", (data) => {
      if (data.busId === bus._id) {
        setBookedSeats((prev) =>
          prev.filter((seat) => seat !== data.seatNumber)
        );
      }
      console.log("Received update (Cancelled):", data);
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("seatStatusUpdate");
      socket.off("seatCancelledUpdate");
    };
  }, [bus]);

  // ✅ Booking function (এই কোড ঠিক আছে)
  const handleBooking = async () => {
    if (!selectedSeat) return toast.error("Please select a seat");
    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        { busId: bus._id, seatNumber: selectedSeat },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Seat booked!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  // ... (বাকি সব JSX কোড অপরিবর্তিত থাকবে) ...
  if (!bus)
    return <p className="p-6 text-gray-500">No bus selected. Go back.</p>;

  if (!user)
    return (
      <p className="p-6 text-red-500">
        Please{" "}
        <Link className="text-shadow-black" to="/login">
          login
        </Link>{" "}
        to book a seat.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Choose Your Seat — {bus.busName}
      </h1>

      <div className="grid grid-cols-4 gap-2 w-64 mb-6">
        {seats.map((num) => {
          const isBooked = bookedSeats.includes(num);
          const isSelected = num === selectedSeat;
          return (
            <button
              key={num}
              onClick={() => !isBooked && setSelectedSeat(num)}
              // ⭐️ 'disabled' অ্যাট্রিবিউট যোগ করা ভালো
              disabled={isBooked} 
              className={`p-3 border rounded ${
                isBooked
                  ? "bg-red-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-green-100"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}