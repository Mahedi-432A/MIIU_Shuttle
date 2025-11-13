// src/pages/EditProfile.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  // প্রোফাইল পেজ থেকে state-এর মাধ্যমে পাঠানো ডাটা
  const [formData, setFormData] = useState(location.state?.profile);

  if (!formData) {
    // যদি কোনো কারণে state না আসে (যেমন: পেজ রিফ্রেশ)
    // তাহলে ইউজারকে প্রোফাইল পেজে ফেরত পাঠানো ভালো
    navigate("/profile");
    return null; 
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.put("/secure/profile", formData);
      toast.success("Profile updated successfully!");
      navigate("/profile"); // আপডেট করে প্রোফাইল পেজে ফেরত যান
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Edit Profile
        </h2>

        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        
        <label className="block text-sm font-medium text-gray-700">Email (Cannot be changed)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          className="w-full p-2 mb-3 border rounded bg-gray-100"
          disabled
        />
        
        <label className="block text-sm font-medium text-gray-700">Student ID</label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">Batch</label>
        <input
          type="text"
          name="batch"
          value={formData.batch}
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />

        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          className="w-full p-2 mb-4 border rounded"
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}