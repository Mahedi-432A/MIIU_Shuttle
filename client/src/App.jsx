import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./constext/AuthContext";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
// import Booking from "./pages/Booking"; // ❌ 
import AvailableBuses from "./pages/AvailableBuses"; 
import SeatSelection from "./pages/SeatSelection";
import MyBookings from "./pages/MyBookings";
import EditProfile from "./pages/EditProfile";
import SplashScreen from "./pages/SplashScreen";
import SignupSuccess from "./pages/SignupSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingConfirmed from "./pages/BookingConfirmed"; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* গ্লোবাল র‍্যাপার */}
        <div className="max-w-md mx-auto min-h-screen shadow-lg bg-white relative">
          <div className="pb-20"> {/* বটম ন্যাভবারের জন্য প্যাডিং */}
            <Routes>
              {/* পাবলিক রুট */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup-success" element={<SignupSuccess />} />

              {/* প্রোটেক্টেড রুট */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/available-buses" 
                element={
                  <ProtectedRoute>
                    <AvailableBuses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seat-selection"
                element={
                  <ProtectedRoute>
                    <SeatSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-confirmed"
                element={
                  <ProtectedRoute>
                    <BookingConfirmed />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          {/* প্রোটেক্টেড পেজগুলোতে বটম ন্যাভবার দেখান */}
          <NavbarWrapper />
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// NavbarWrapper ()
const NavbarWrapper = () => {
  const location = useLocation();
  // এই পেজগুলোতে Navbar দেখাবে না
  const publicRoutes = ["/", "/login", "/register", "/signup-success"];
  if (publicRoutes.includes(location.pathname)) {
    return null;
  }
  // অন্য সব (প্রোটেক্টেড) পেজে Navbar দেখাবে
  return <Navbar />;
};