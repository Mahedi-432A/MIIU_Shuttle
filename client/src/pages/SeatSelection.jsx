import { useEffect, useState } from "react";
// ⭐️ পরিবর্তন: utils থেকে আপনার instance ইম্পোর্ট করুন
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// ⭐️ পরিবর্তন: utils থেকে আপনার socket instance ইম্পোর্ট করুন
import { socket } from "../utils/socket";

// ❌ const socket = io(...) (আর দরকার নেই)

export default function SeatSelection() {
  const { token, user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus;

  // ✅ Load booked seats from API
  useEffect(() => {
    if (!bus || !token) return;

    const fetchBooked = async () => {
      try {
        // ⭐️ পরিবর্তন: 'instance' ব্যবহার করুন এবং headers বাদ দিন
        const res = await instance.get(`/bookings/bus/${bus._id}`);
        setBookedSeats(res.data);
      } catch (error) {
        console.error("Failed to fetch booked seats", error);
        toast.error("Failed to load seats. Please try again.");
      }
    };

    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
    fetchBooked();
  }, [bus, token]);

  // ✅ Realtime update listener + Room Join
  useEffect(() => {
    if (!bus) return;

    socket.emit("joinBusRoom", bus._id);
    console.log(`Attempting to join room: ${bus._id}`);

    // লিসেনার: যখন কোনো সিট বুক হয়
    socket.on("seatStatusUpdate", (data) => {
      if (data.busId === bus._id) {
        setBookedSeats((prev) =>
          prev.includes(data.seatNumber) ? prev : [...prev, data.seatNumber]
        );
      }
      console.log("Received update (Booked):", data);
    });

    // লিসেনার: যখন কোনো সিট ক্যানসেল হয়
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

  // ✅ Booking function
  const handleBooking = async () => {
    if (!selectedSeat) return toast.error("Please select a seat");
    try {
      // ⭐️ পরিবর্তন: 'instance' ব্যবহার করুন এবং headers বাদ দিন
      await instance.post("/bookings", {
        busId: bus._id,
        seatNumber: selectedSeat,
      });

      toast.success("Seat booked!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  // ... (বাকি JSX কোড অপরিবর্তিত) ...
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