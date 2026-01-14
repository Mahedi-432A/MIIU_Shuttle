import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./constext/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationHandler from "./components/NotificationHandler"; // ✅ ইম্পোর্ট

// Pages (Lazy Loaded)
const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SignupSuccess = lazy(() => import("./pages/SignupSuccess"));
const Home = lazy(() => import("./pages/Home"));
const AvailableBuses = lazy(() => import("./pages/AvailableBuses"));
const SeatSelection = lazy(() => import("./pages/SeatSelection"));
const BookingConfirmed = lazy(() => import("./pages/BookingConfirmed"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const More = lazy(() => import("./pages/More"));
const TripHistory = lazy(() => import("./pages/TripHistory"));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-md min-h-screen mx-auto shadow-lg bg-theme-bg">
          <NotificationHandler /> {/* ✅ এখানে যোগ করুন */}
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
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
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <TripHistory />
                </ProtectedRoute>
              }
            />
            </Routes>
          </Suspense>
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
