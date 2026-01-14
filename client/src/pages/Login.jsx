import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; 
import logo from "../assets/icons and logo/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate(from, { replace: true }); 
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen p-8 bg-[#fcf8f0]">
      {/* উপরের খালি অংশ */}
      <div></div>

      {/* মাঝের কন্টেন্ট */}
      <div className="flex flex-col items-center">
        {/* লোগো */}
        <div className="flex items-center justify-center w-40 h-40 mb-4 shadow-md rounded-4xl">
          <img src={logo} alt="Logo" className="w-full" />
        </div>

        <h2 className="mb-6 text-xl font-semibold text-gray-700">
          Welcome to MIU Shuttle
        </h2>

        <form onSubmit={handleLogin} className="w-full">
          {/* ইমেইল ফিল্ড */}
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* পাসওয়ার্ড ফিল্ড */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 right-4 top-4"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Keep me signed in এবং Forgot Password */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2" />
              Keep me signed in
            </label>
            <a href="#" className="font-medium text-gray-600">
              Forgot Password?
            </a>
          </div>

          {/* লগইন বাটন */}
          <button className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg">
            Login
          </button>
        </form>
      </div>

      {/* Create an account */}
      <div className="text-center">
        <Link to="/register" className="font-medium text-green-600">
          Create an account
        </Link>
      </div>
    </div>
  );
}
