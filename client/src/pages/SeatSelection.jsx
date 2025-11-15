// ... (imports) ...
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRound, ChevronLeft, ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { useAuth } from "../constext/AuthContext";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";

// ... (RESERVED_SEATS, useEffects, isSeatDisabled - অপরিবর্তিত) ...
const RESERVED_SEATS = [1, 2, 3, 4];

export default function SeatSelection() {
  const { profile } = useAuth();
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { bus, journeyInfo } = location.state || {};

  useEffect(() => {
    if (!bus) return;
    setSeats(Array.from({ length: bus.totalSeats || 40 }, (_, i) => i + 1));
    const fetchBooked = async () => {
      try {
        const res = await instance.get(`/bookings/bus/${bus._id}`);
        setBookedSeats(res.data);
      } catch (error) { toast.error("Failed to load seats."); }
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

  const isSeatDisabled = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return true;
    if (!profile) return true;
    const userRole = profile.role;
    const isReserved = RESERVED_SEATS.includes(seatNumber);
    const isStudentBus = bus.busType !== "Faculty";
    if (userRole === "Student") {
      if (isReserved) return true;
    }
    if (userRole === "Faculty" || userRole === "Stuff") {
      if (isStudentBus) {
        if (!isReserved) return true;
      }
    }
    return false;
  };


  // ✅ বুকিং হ্যান্ডেল (আপডেটেড)
  const handleBooking = async () => {
    if (!selectedSeat) return toast.error("Please select a seat");
    
    // ✅ journeyTimestamp তৈরি করুন
    // 1. বাস ছাড়ার সময় (e.g., "13:45")
    const [hours, minutes] = bus.departureTime.split(':');
    // 2. জার্নির তারিখ (Home পেজ থেকে আসা Date অবজেক্ট)
    const journeyTimestamp = new Date(journeyInfo.dateObject);
    // 3. তারিখের সাথে সময় সেট করুন
    journeyTimestamp.setHours(hours, minutes, 0, 0);

    try {
      await instance.post("/bookings", {
        busId: bus._id,
        seatNumber: selectedSeat,
        journeyFrom: journeyInfo.from,
        journeyTo: journeyInfo.to,
        journeyDate: journeyInfo.dateString, // ✅ ডিসপ্লে স্ট্রিং
        journeyTimestamp: journeyTimestamp,     // ✅ Date অবজেক্ট
      });
      toast.success("Seat booked!");
      navigate("/booking-confirmed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (!bus || !journeyInfo) {
    // ... (no bus selected fallback) ...
    return (
      <div className="min-h-screen p-6 pb-24 bg-theme-bg">
        <p>No bus selected.</p>
        <Link to="/home">Go back to Home</Link>
      </div>
    );
  }

  const availableSeatsLeft = (bus.totalSeats || 40) - bookedSeats.length;
  const isStudentBus = bus.busType !== "Faculty";

  return (
    <div className="min-h-screen p-6 pb-24 bg-theme-bg">
      {/* ... (হেডার অপরিবর্তিত) ... */}
      <header className="flex items-center justify-between mb-6">
        <Link to="/available-buses" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">
          Hello, {profile?.fullName.split(" ")[0] || "User"}!
        </h1>
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
        >
          <UserRound size={24} className="text-gray-500" />
        </Link>
      </header>
      <p className="mb-4 -mt-4 text-center text-gray-600">Choose your seat!</p>

      {/* জার্নি ডিটেইলস কার্ড (✅ আপডেটেড) */}
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
          {/* ✅ dateString (ফরম্যাটেড স্ট্রিং) ব্যবহার করুন */}
          <span className="font-semibold">{journeyInfo.dateString}</span>
        </div>
      </div>

      {/* ... (সিট লেআউট, লিজেন্ড, এবং কনফার্ম বাটন অপরিবর্তিত) ... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="w-full p-4 bg-white shadow rounded-2xl">
          <div className="grid grid-cols-4 gap-3">
            {seats.map((num) => {
              const isDisabled = isSeatDisabled(num);
              const isSelected = selectedSeat === num;
              let seatClass = "bg-gray-200";
              if (bookedSeats.includes(num)) seatClass = "bg-yellow-400";
              if (isSelected) seatClass = "bg-red-500";
              if (
                isStudentBus &&
                RESERVED_SEATS.includes(num) &&
                !bookedSeats.includes(num) &&
                !isSelected
              ) {
                seatClass = "bg-blue-200";
              }
              return (
                <button
                  key={num}
                  disabled={isDisabled}
                  onClick={() => setSelectedSeat(num)}
                  className={`w-full h-12 rounded-lg ${seatClass}
                    ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                    ${isSelected ? "ring-2 ring-red-700" : ""}
                  `}
                ></button>
              );
            })}
          </div>
        </div>
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
            {isStudentBus ? (
              <>
                <li className="flex items-center">
                  <div className="w-5 h-5 mr-3 bg-blue-200 rounded-full"></div>
                  <span>Reserved (Faculty/Stuff)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 mr-3 bg-gray-200 rounded-full"></div>
                  <span>Available (Student)</span>
                </li>
              </>
            ) : (
              <li className="flex items-center">
                <div className="w-5 h-5 mr-3 bg-gray-200 rounded-full"></div>
                <span>Available</span>
              </li>
            )}
          </ul>
          <div className="pt-4 mt-4 border-t">
            <div className="px-4 py-2 font-bold text-center text-green-700 bg-green-100 rounded-lg">
              {availableSeatsLeft} Seats left
            </div>
          </div>
        </div>
      </div>
      
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