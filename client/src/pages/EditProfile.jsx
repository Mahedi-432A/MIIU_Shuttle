import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // ✅ Link ইম্পোর্ট
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react"; // ✅ ব্যাক বাটন আইকন

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const profile = location.state?.profile;

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    mobile: profile?.mobile || "",
    gender: profile?.gender || "Male",
    studentId: profile?.roleSpecific?.studentId || "",
    department: profile?.roleSpecific?.department || "",
    batch: profile?.roleSpecific?.batch || "",
    facultyId: profile?.roleSpecific?.facultyId || "",
    designation: profile?.roleSpecific?.designation || "",
    stuffId: profile?.roleSpecific?.stuffId || "",
  });

  const role = profile?.role;

  if (!profile) {
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
      let roleSpecific = {};
      if (role === "Student") {
        roleSpecific = {
          studentId: formData.studentId,
          department: formData.department,
          batch: formData.batch,
        };
      } else if (role === "Faculty") {
        roleSpecific = {
          facultyId: formData.facultyId,
          department: formData.department,
          designation: formData.designation,
        };
      } else if (role === "Stuff") {
        roleSpecific = {
          stuffId: formData.stuffId,
          department: formData.department,
          designation: formData.designation,
        };
      }
      
      const updatedData = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        gender: formData.gender,
        roleSpecific,
      };

      await instance.put("/secure/profile", updatedData);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // কন্ডিশনাল ফিল্ড রেন্ডার (নতুন ডিজাইন সহ)
  const renderRoleFields = () => {
    if (role === "Student") {
      return (
        <>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            placeholder="Student ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <div className="flex space-x-4">
            <input
              type="text"
              name="department"
              value={formData.department}
              placeholder="Department"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
            <input
              type="text"
              name="batch"
              value={formData.batch}
              placeholder="Batch"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
    if (role === "Faculty") {
      return (
        <>
          <input
            type="text"
            name="facultyId"
            value={formData.facultyId}
            placeholder="Faculty ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <div className="flex space-x-4">
            <input
              type="text"
              name="department"
              value={formData.department}
              placeholder="Department"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
            <input
              type="text"
              name="designation"
              value={formData.designation}
              placeholder="Designation"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
    if (role === "Stuff") {
      return (
        <>
          <input
            type="text"
            name="stuffId"
            value={formData.stuffId}
            placeholder="Stuff ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <div className="flex space-x-4">
            <input
              type="text"
              name="department"
              value={formData.department}
              placeholder="Department"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
            <input
              type="text"
              name="designation"
              value={formData.designation}
              placeholder="Designation"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
  };

  return (
    // ✅ নতুন ডিজাইন: রেজিস্টার পেজের মতো
    <div className="flex flex-col h-screen p-6 pb-24 bg-theme-bg">
      {/* ✅ নতুন হেডার */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)} // প্রোফাইল পেজে ফেরত যান
          className="p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center grow">
          Edit Profile
        </h1>
      </header>

      {/* ✅ নতুন ফর্ম ডিজাইন */}
      <form
        onSubmit={handleSubmit}
        className="pb-4 space-y-4 overflow-y-auto"
      >
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Full Name"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          placeholder="Mobile"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
        <select
          name="gender"
          value={formData.gender}
          className="w-full p-4 bg-white border border-gray-300 rounded-lg"
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        {/* ইমেইল (শুধুমাত্র দেখানোর জন্য) */}
        <input
          type="email"
          value={profile.email}
          placeholder="Email (Cannot be changed)"
          className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg"
          disabled
        />

        {/* কন্ডিশনাল ফিল্ড */}
        {renderRoleFields()}

        <button className="w-full py-4 mt-4 text-lg font-semibold text-white bg-green-400 rounded-lg shadow-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
}
