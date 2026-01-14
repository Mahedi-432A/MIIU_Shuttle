import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// হিস্ট্রি কার্ড
const HistoryCard = ({ booking }) => {
  const { busId, seatNumber, journeyFrom, journeyTo, journeyTimestamp } = booking;
  
  // তারিখ ও সময় ফরম্যাট (e.g., "Nov 15, 1:45 PM")
  const formattedDate = new Date(journeyTimestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800">{journeyFrom}</span>
        <ArrowRight size={20} className="text-gray-500" />
        <span className="text-lg font-bold text-gray-800">{journeyTo}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {formattedDate}
      </p>
      <p className="text-sm text-gray-600">
        Bus No: {busId?.busName || "N/A"} | Seat: {seatNumber}
      </p>
    </div>
  );
};

export default function TripHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await instance.get("/bookings/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen pb-24 bg-theme-bg">
      {/* হেডার */}
      <header className="flex items-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-center text-gray-800 grow">
          Trip History
        </h1>
      </header>

      {/* পেজ কন্টেন্ট */}
      <div className="px-6">
        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-theme-green" size={40} />
          </div>
        ) : history.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            You have no completed trips yet.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((booking) => (
              <HistoryCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
