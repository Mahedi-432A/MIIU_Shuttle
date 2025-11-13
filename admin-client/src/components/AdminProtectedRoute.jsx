import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AdminProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // যদি ইউজার লগইন করা থাকে এবং অ্যাডমিন হয়
  if (user && isAdmin) {
    return children;
  }

  // না হলে লগইন পেজে পাঠান
  return <Navigate to="/login" replace />;
}