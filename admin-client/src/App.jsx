import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Lazy Loaded Pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const BusManagement = lazy(() => import("./pages/BusManagement"));
const NoticeManagement = lazy(() => import("./pages/NoticeManagement"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
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
    </Suspense>
  );
}