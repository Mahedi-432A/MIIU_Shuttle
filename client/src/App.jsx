import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./constext/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationHandler from "./components/NotificationHandler"; // ✅ ইম্পোর্ট

// Pages
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignupSuccess from "./pages/SignupSuccess";
import Home from "./pages/Home";
import AvailableBuses from "./pages/AvailableBuses";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmed from "./pages/BookingConfirmed";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";
import More from "./pages/More";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-md min-h-screen mx-auto shadow-lg bg-theme-bg">
          <NotificationHandler /> {/* ✅ এখানে যোগ করুন */}
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
              path="/seat-selection"
              element={
                <ProtectedRoute>
                  <SeatSelection />
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
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
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
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/more"
              element={
                <ProtectedRoute>
                  <More />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" />
          <NavbarWrapper />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// NavbarWrapper (আগের মতোই)
const NavbarWrapper = () => {
  const location = useLocation();
  const publicRoutes = ["/", "/login", "/register", "/signup-success"];
  if (publicRoutes.includes(location.pathname)) {
    return null;
  }
  return <Navbar />;
};
