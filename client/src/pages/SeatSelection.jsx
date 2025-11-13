import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";
import { UserRound, ChevronLeft, ArrowRightLeft } from "lucide-react";

export default function SeatSelection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [seats, setSeats] = useState([]); // 
  const [bookedSeats, setBookedSeats] = useState([]); 
  const [selectedSeat, setSelectedSeat] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  const { bus, journeyInfo } = location.state || {};

  // প্রোফাইল লোড
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

  // সিট লোড এবং সকেট লিসেনার
  useEffect(() => {
    if (!bus) return;

    // মোট সিট তৈরি
    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));

    // বুকড সিটগুলো লোড
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

    // সকেট
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

  // বুকিং হ্যান্ডেল
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
      <div className="p-6">
        <p>No bus selected.</p>
        <Link to="/home">Go back to Home</Link>
      </div>
    );
  }

  const availableSeatsLeft = (bus.totalSeats || 40) - bookedSeats.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* হেডার */}
      <header className="flex justify-between items-center mb-6">
        <Link to="/available-buses" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">
          Hello, {profile?.fullName.split(" ")[0] || "User"}!
        </h1>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <UserRound size={24} className="text-gray-500" />
        </div>
      </header>
      <p className="text-center text-gray-600 mb-4 -mt-4">Choose your seat!</p>

      {/* জার্নি ডিটেইলস কার্ড */}
      <div className="bg-green-600 rounded-2xl p-5 shadow-lg text-white mb-6">
        <div className="text-center mb-2 font-semibold">Bus no: {bus.busName}</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{journeyInfo.from}</span>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-4 border-green-600">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold">{journeyInfo.to}</span>
        </div>
        <div className="text-center mt-4 border-t border-green-500 pt-2">
          <span className="font-semibold">{journeyInfo.date}</span>
        </div>
      </div>

      {/* সিট লেআউট ও লিজেন্ড */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* সিট লেআউট */}
        <div className="w-full bg-white p-4 rounded-2xl shadow">
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
                    isBooked
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    isSelected
                      ? "ring-2 ring-red-700"
                      : ""
                  }`}
                >
                  {/* {num} */}
                </button>
              );
            })}
          </div>
        </div>

        {/* লিজেন্ড */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow">
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-400 mr-3"></div>
              <span>Booked</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div>
              <span>Your Seat</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <span>Available</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t">
            <div className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-center">
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
            className="w-full bg-yellow-400 text-gray-900 py-4 rounded-lg text-lg font-bold shadow disabled:opacity-50"
          >
            Confirm booking
          </button>
        ) : (
          <div>
            <p className="text-center text-red-600 font-semibold mb-4">
              Sorry, no seats are available on this bus.
            </p>
            <button
              disabled
              className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-bold shadow opacity-70 cursor-not-allowed"
            >
              Request for Extra Bus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}