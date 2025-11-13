import { useAuth } from "../constext/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react"; // লোডিং আইকন

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Firebase থেকে ইউজার স্টেট লোড হওয়ার জন্য অপেক্ষা
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    // যদি ইউজার লগইন করা না থাকে, তাকে লগইন পেজে পাঠান
    // 'state={{ from: location }}' মনে রাখে সে কোথায় যেতে চেয়েছিল
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // যদি লগইন করা থাকে, তবে তাকে কাঙ্ক্ষিত পেজটি দেখান
  return children;
}