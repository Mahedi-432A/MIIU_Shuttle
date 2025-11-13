
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./constext/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import SeatSelection from "./pages/SeatSelection";
import MyBookings from "./pages/MyBookings";
import EditProfile from "./pages/EditProfile";
import SplashScreen from "./pages/SplashScreen"; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ গ্লোবাল মোবাইল র‍্যাপার */}
        <div className="max-w-md mx-auto min-h-screen shadow-lg bg-white">
          
          <NavbarWrapper />

          <Routes>
            {/* ✅ রুট পরিবর্তন */}
            <Route path="/" element={<SplashScreen />} /> 
            <Route path="/home" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seat-selection" element={<SeatSelection />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Helper Component যা ঠিক করবে কখন Navbar দেখাবে
import { useLocation } from "react-router-dom";
const NavbarWrapper = () => {
  const location = useLocation();
  // স্প্ল্যাশ স্ক্রিনে (/) Navbar দেখাবে না
  if (location.pathname === "/") {
    return null;
  }
  return <Navbar />;
};