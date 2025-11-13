import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import DashboardLayout from "./components/DashboardLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import BusManagement from "./pages/BusManagement";
import NoticeManagement from "./pages/NoticeManagement";
import DashboardHome from "./pages/DashboardHome";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <DashboardLayout />
          </AdminProtectedRoute>
        }
      >
        {/* DashboardLayout এর ভেতরের পেজ */}
        <Route index element={<DashboardHome />} />
        <Route path="buses" element={<BusManagement />} />
        <Route path="notices" element={<NoticeManagement />} />
      </Route>
    </Routes>
  );
}