import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../constext/AuthContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking cancelled");
      fetchBookings(); // Refresh
    } catch (err) {
      toast.error("Failed to cancel booking: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        My Bookings — {user?.email}
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{b.busId?.busName}</h2>
                <p className="text-sm text-gray-600">
                  {b.busId?.routeFrom} → {b.busId?.routeTo}
                </p>
                <p className="text-sm text-gray-500">
                  Seat No: {b.seatNumber} | {new Date(b.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleCancel(b._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
