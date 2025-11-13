import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bus } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext স্বয়ংক্রিয়ভাবে ক্লেইম চেক করবে
      toast.success("Admin login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to login. Are you an admin?");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-green">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Bus size={32} className="text-theme-green" />
            <span className="text-2xl font-bold text-gray-800">
              Admin Panel
            </span>
          </div>
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-700">
          MIU Shuttle Service
        </h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full rounded-md border p-3"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border p-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full rounded-md bg-theme-green p-3 text-lg font-semibold text-white shadow-lg hover:bg-green-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}