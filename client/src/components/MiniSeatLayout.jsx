import React from "react";
// import { Steering } from "lucide-react";

// ✅ totalSeats prop যোগ করা হয়েছে (ডিফল্ট ৪০)
const MiniSeatLayout = ({ bookedSeat, totalSeats = 40 }) => {
  // ✅ ৪০ এর বদলে totalSeats ব্যবহার করা হয়েছে
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="w-32 p-3 bg-white border border-gray-200 shadow-lg rounded-xl">
      {/* ড্রাইভার সিট */}
      {/* <div className="flex justify-end mb-2">
        <Steering size={24} className="text-yellow-500" />
      </div> */}

      {/* সিট গ্রিড */}
      <div className="grid grid-cols-4 gap-1.5">
        {seats.map((seatNum) => {
          const isBooked = seatNum === bookedSeat;
          return (
            <div
              key={seatNum}
              className={`w-full h-5 rounded ${
                isBooked ? "bg-red-500" : "bg-gray-200"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniSeatLayout;