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
import SignupSuccess from "./pages/SignupSuccess"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* গ্লোবাল র‍্যাপার () */}
        <div className="max-w-md mx-auto min-h-screen shadow-lg bg-white">
          <NavbarWrapper />
          <Routes>
            {/* ==============================
              পাবলিক রুট 
              ==============================
            */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup-success" element={<SignupSuccess />} />

            {/* ==============================
              প্রোটেক্টেড রুট 
              ==============================
            */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
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
          </Routes>
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// NavbarWrapper ()
import { useLocation } from "react-router-dom";
const NavbarWrapper = () => {
  const location = useLocation();
  // এই পেজগুলোতে Navbar দেখাবে না
  const noNavRoutes = ["/", "/login", "/register", "/signup-success"];
  if (noNavRoutes.includes(location.pathname)) {
    return null;
  }
  return <Navbar />;
};