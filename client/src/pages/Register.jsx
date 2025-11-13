// src/pages/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import instance from "../utils/axiosConfig"; // ✅ axios instance ইম্পোর্ট
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // ✅ নতুন state
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
  });
  const navigate = useNavigate();

  // ✅ ইনপুট হ্যান্ডেল করার জন্য
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, fullName, mobile } = formData;

    // ভ্যালিডেশন
    if (!fullName || !mobile || !email || !password) {
      return toast.error("Please fill in all required fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      // ধাপ ১: Firebase-এ ইউজার তৈরি করুন
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ধাপ ২: আমাদের ব্যাকএন্ডে বাকি ডিটেইলস সেভ করুন
      // (axiosConfig স্বয়ংক্রিয়ভাবে টোকেন পাঠাবে)
      await instance.post("/secure/register-details", formData);

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      // Firebase বা আমাদের সার্ভারের এরর দেখান
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        {/* নতুন ইনপুট ফিল্ড */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="studentId"
          placeholder="Student ID (Optional)"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department (Optional)"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="batch"
          placeholder="Batch (Optional)"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <select
          name="gender"
          className="w-full p-2 mb-4 border rounded"
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}