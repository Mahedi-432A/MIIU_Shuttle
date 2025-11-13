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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
}
