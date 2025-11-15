// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/firebase.config";
// import instance from "../utils/axiosConfig";
// import toast from "react-hot-toast";
// import { useNavigate, Link } from "react-router-dom";
// import { ChevronLeft, Eye, EyeOff } from "lucide-react";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobile: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     studentId: "",
//     department: "",
//     batch: "",
//     gender: "Male",
//     agree: false,
//   });
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const { email, password, confirmPassword, fullName, mobile, agree } =
//       formData;

//     // ভ্যালিডেশন
//     if (!fullName || !mobile || !email || !password) {
//       return toast.error("Name, Mobile, Email, and Password are required.");
//     }
//     if (password.length < 6) {
//       return toast.error("Password must be at least 6 characters long.");
//     }
//     if (password !== confirmPassword) {
//       return toast.error("Passwords do not match!");
//     }
//     if (!agree) {
//       return toast.error("You must accept the Terms and Conditions.");
//     }

//     try {
//       // ধাপ ১: Firebase-এ ইউজার তৈরি করুন
//       await createUserWithEmailAndPassword(auth, email, password);

//       // ধাপ ২: আমাদের ব্যাকএন্ডে বাকি ডিটেইলস সেভ করুন
//       const detailsToSave = { ...formData };
//       delete detailsToSave.password;
//       delete detailsToSave.confirmPassword;
//       delete detailsToSave.agree;

//       await instance.post("/secure/register-details", detailsToSave);

//       toast.success("Account created successfully!");
//       navigate("/signup-success"); 
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen p-6 bg-[#fcf8f0]">
//       {/* হেডার */}
//       <div className="flex items-center mb-6">
//         <Link to="/login" className="p-2">
//           <ChevronLeft size={24} />
//         </Link>
//         <h1 className="flex-grow text-2xl font-bold text-center">
//           Create an account
//         </h1>
//       </div>

//       {/* ফর্ম */}
//       <form
//         onSubmit={handleRegister}
//         className="pb-4 space-y-4 overflow-y-auto"
//       >
//         <input
//           type="text"
//           name="fullName" 
//           placeholder="Name"
//           className="w-full p-4 border border-gray-300 rounded-lg"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="studentId"
//           placeholder="Student ID"
//           className="w-full p-4 border border-gray-300 rounded-lg"
//           onChange={handleChange}
//         />
//         {/* Department এবং Batch পাশাপাশি */}
//         <div className="flex space-x-4">
//           <input
//             type="text"
//             name="department"
//             placeholder="Department"
//             className="w-1/2 p-4 border border-gray-300 rounded-lg"
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="batch"
//             placeholder="Batch"
//             className="w-1/2 p-4 border border-gray-300 rounded-lg"
//             onChange={handleChange}
//           />
//         </div>
//         <input
//           type="tel"
//           name="mobile" 
//           placeholder="Phone number"
//           className="w-full p-4 border border-gray-300 rounded-lg"
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           className="w-full p-4 border border-gray-300 rounded-lg"
//           onChange={handleChange}
//         />
        
//         <div className="relative w-full">
//           <input
//             type={showPass ? "text" : "password"}
//             name="password"
//             placeholder="Password (6 digit)"
//             className="w-full p-4 border border-gray-300 rounded-lg"
//             onChange={handleChange}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPass(!showPass)}
//             className="absolute text-gray-500 right-4 top-4"
//           >
//             {showPass ? <EyeOff /> : <Eye />}
//           </button>
//         </div>
//         <div className="relative w-full">
//           <input
//             type={showConfirmPass ? "text" : "password"}
//             name="confirmPassword"
//             placeholder="Confirm password"
//             className="w-full p-4 border border-gray-300 rounded-lg"
//             onChange={handleChange}
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPass(!showConfirmPass)}
//             className="absolute text-gray-500 right-4 top-4"
//           >
//             {showConfirmPass ? <EyeOff /> : <Eye />}
//           </button>
//         </div>

//         <select
//           name="gender"
//           className="w-full p-4 border border-gray-300 rounded-lg"
//           onChange={handleChange}
//           value={formData.gender}
//         >
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>

//         <label className="flex items-center text-sm text-gray-600">
//           <input
//             type="checkbox"
//             name="agree"
//             className="mr-2"
//             onChange={handleChange}
//           />
//           I accept the Trams and condition
//         </label>

//         {/* বাটন */}
//         <button className="w-full py-4 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg">
//           Confirmation
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("Student"); // ডিফল্ট রোল
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();

  // সব ইনপুট ফিল্ডের জন্য একটি স্টেট
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    agree: false,
    // রোলের জন্য আলাদা স্টেট
    studentId: "",
    department: "",
    batch: "",
    facultyId: "",
    designation: "",
    stuffId: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    // রোল পরিবর্তন করলে অপ্রয়োজনীয় ফিল্ডগুলো রিসেট করা ভালো
    setFormData((prev) => ({
      ...prev,
      studentId: "", department: "", batch: "",
      facultyId: "", designation: "", stuffId: "",
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, fullName, mobile, gender, agree } = formData;

    // ভ্যালিডেশন
    if (!fullName || !mobile || !email || !password || !agree) {
      return toast.error("Please fill all required fields and agree to terms.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    // ✅ রোলের উপর ভিত্তি করে ডাটা প্রস্তুত করুন
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

    try {
      // ধাপ ১: Firebase-এ ইউজার তৈরি করুন
      await createUserWithEmailAndPassword(auth, email, password);

      // ধাপ ২: আমাদের ব্যাকএন্ডে বাকি ডিটেইলস সেভ করুন
      await instance.post("/secure/register-details", {
        fullName,
        mobile,
        gender,
        role,
        roleSpecific,
      });

      toast.success("Account created successfully!");
      navigate("/signup-success");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ✅ কন্ডিশনাল ফিল্ড রেন্ডার করার ফাংশন
  const renderRoleFields = () => {
    if (role === "Student") {
      return (
        <>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
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
        </>
      );
    }
    if (role === "Faculty") {
      return (
        <>
          <input
            type="text"
            name="facultyId"
            placeholder="Faculty ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
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
              name="designation"
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
            placeholder="Stuff ID"
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
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
              name="designation"
              placeholder="Designation"
              className="w-1/2 p-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-theme-bg">
      {/* হেডার */}
      <div className="flex items-center mb-6">
        <Link to="/login" className="p-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="flex-grow text-2xl font-bold text-center">
          Create an account
        </h1>
      </div>

      {/* ফর্ম */}
      <form
        onSubmit={handleRegister}
        className="pb-4 space-y-4 overflow-y-auto"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Name"
          className="w-full p-4 border border-gray-300 rounded-lg"
          onChange={handleChange}
        />
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

        {/* ✅ রোল সিলেক্টর */}
        <select
          name="role"
          value={role}
          onChange={handleRoleChange}
          className="w-full p-4 bg-white border border-gray-300 rounded-lg"
        >
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Stuff">Stuff</option>
        </select>
        
        {/* ✅ কন্ডিশনাল ফিল্ড */}
        {renderRoleFields()}
        
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-4 bg-white border border-gray-300 rounded-lg"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

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
            className="absolute text-gray-500 right-4 top-4"
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
            className="absolute text-gray-500 right-4 top-4"
          >
            {showConfirmPass ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            className="mr-2"
            onChange={handleChange}
          />
          I accept the Terms and condition
        </label>

        <button className="w-full py-4 mt-4 text-lg font-semibold text-white rounded-lg shadow-lg bg-theme-green">
          Register
        </button>
      </form>
    </div>
  );
}