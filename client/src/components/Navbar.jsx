import { Link } from "react-router-dom";
import { useAuth } from "../constext/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    // Navbar এর উচ্চতা (py-3) প্রায় 64px ধরে আমরা Login পেজে ক্যালকুলেশন করেছি।
    <nav className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white h-16">
      <Link to="/home" className="font-bold text-lg"> {/* ✅ পরিবর্তন */}
        SmartSeat
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/booking">Booking</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}