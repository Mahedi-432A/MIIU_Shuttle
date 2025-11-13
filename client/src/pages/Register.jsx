import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    batch: "",
    gender: "Male",
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, fullName, mobile, agree } =
      formData;

    // ভ্যালিডেশন
    if (!fullName || !mobile || !email || !password) {
      return toast.error("Name, Mobile, Email, and Password are required.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (!agree) {
      return toast.error("You must accept the Terms and Conditions.");
    }

    try {
      // ধাপ ১: Firebase-এ ইউজার তৈরি করুন
      await createUserWithEmailAndPassword(auth, email, password);

      // ধাপ ২: আমাদের ব্যাকএন্ডে বাকি ডিটেইলস সেভ করুন
      const detailsToSave = { ...formData };
      delete detailsToSave.password;
      delete detailsToSave.confirmPassword;
      delete detailsToSave.agree;

      await instance.post("/secure/register-details", detailsToSave);

      toast.success("Account created successfully!");
      navigate("/signup-success"); 
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-[#fcf8f0]">
      {/* হেডার */}
      <div className="flex items-center mb-6">
        <Link to="/login" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-center flex-grow">
          Create an account
        </h1>
      </div>

      {/* ফর্ম */}
      <form
        onSubmit={handleRegister}
        className="overflow-y-auto space-y-4 pb-4"
      >
        <input
          type="text"
          name="fullName" 
          placeholder="Name"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        {/* Department এবং Batch পাশাপাশি */}
        <div className="flex space-x-4">
          <input
            type="text"
            name="department"
            placeholder="Department"
            className="w-1/2 p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="text"
            name="batch"
            placeholder="Batch"
            className="w-1/2 p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
        </div>
        <input
          type="tel"
          name="mobile" 
          placeholder="Phone number"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        
        <div className="relative w-full">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password (6 digit)"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-4 text-gray-500"
          >
            {showPass ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className="relative w-full">
          <input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-4 top-4 text-gray-500"
          >
            {showConfirmPass ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <select
          name="gender"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.gender}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label className="flex items-center text-gray-600 text-sm">
          <input
            type="checkbox"
            name="agree"
            className="mr-2"
            onChange={handleChange}
          />
          I accept the Trams and condition
        </label>

        {/* বাটন */}
        <button className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold shadow-lg mt-4">
          Confirmation
        </button>
      </form>
    </div>
  );
}