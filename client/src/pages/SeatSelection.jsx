import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../constext/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SeatSelection() {
  const { token, user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus;

  useEffect(() => {
    if (!bus) return;
    const fetchBooked = async () => {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const taken = res.data
        .filter((b) => b.busId._id === bus._id)
        .map((b) => b.seatNumber);
      setBookedSeats(taken);
    };
    // ৪০ সিট ধরা হলো 
    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
    fetchBooked();
  }, [bus]);

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

  if (!bus)
    return <p className="p-6 text-gray-500">No bus selected. Go back.</p>;

  if (!user)
    return <p className="p-6 text-red-500">Please <Link className="text-shadow-black" to='/login'>login</Link> to book a seat.</p>;

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
