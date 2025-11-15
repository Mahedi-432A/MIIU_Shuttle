// import { useEffect, useState } from "react";
// import instance from "../utils/axiosConfig";
// import toast from "react-hot-toast";
// import { Plus, Edit, Trash } from "lucide-react";

// export default function BusManagement() {
//   const [buses, setBuses] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentBus, setCurrentBus] = useState(null);
//   const [formData, setFormData] = useState({
//     busName: "",
//     routeFrom: "",
//     routeTo: "",
//     time: "",
//     totalSeats: 40,
//     driverName: "",
//     driverContact: "",
//     busType: "Combined",
//   });

//   // বাস লোড
//   const fetchBuses = async () => {
//     try {
//       const res = await instance.get("/admin/buses");
//       setBuses(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch buses");
//     }
//   };

//   useEffect(() => {
//     fetchBuses();
//   }, []);

//   // ফর্ম হ্যান্ডেল
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // সাবমিট (অ্যাড/এডিট)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         // আপডেট
//         await instance.put(`/admin/bus/${currentBus._id}`, formData);
//         toast.success("Bus updated successfully");
//       } else {
//         // নতুন অ্যাড
//         await instance.post("/admin/bus", formData);
//         toast.success("Bus added successfully");
//       }
//       resetModal();
//       fetchBuses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to save bus");
//     }
//   };

//   // ডিলিট
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this bus?")) {
//       try {
//         await instance.delete(`/admin/bus/${id}`);
//         toast.success("Bus deleted");
//         fetchBuses();
//       } catch (err) {
//         toast.error("Failed to delete bus");
//       }
//     }
//   };

//   // মোডাল রিসেট
//   const resetModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentBus(null);
//     setFormData({
//       busName: "", routeFrom: "", routeTo: "", time: "",
//       totalSeats: 40, driverName: "", driverContact: "", busType: "Combined",
//     });
//   };

//   // এডিট মোড চালু
//   const openEditModal = (bus) => {
//     setFormData({
//       busName: bus.busName,
//       routeFrom: bus.routeFrom,
//       routeTo: bus.routeTo,
//       time: bus.time,
//       totalSeats: bus.totalSeats,
//       driverName: bus.driverName || "",
//       driverContact: bus.driverContact || "",
//       busType: bus.busType,
//     });
//     setCurrentBus(bus);
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   // অ্যাড মোড চালু
//   const openAddModal = () => {
//     resetModal();
//     setShowModal(true);
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">Bus Management</h1>
//         <button
//           onClick={openAddModal}
//           className="flex items-center px-4 py-2 space-x-2 font-semibold text-white rounded-lg bg-theme-green hover:bg-green-700"
//         >
//           <Plus size={20} />
//           <span>Add New Bus</span>
//         </button>
//       </div>

//       {/* বাস টেবিল (রেসপন্সিভ) */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="w-full min-w-[600px]">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Bus Name</th>
//               <th className="p-3 text-left">Route</th>
//               <th className="p-3 text-left">Type</th>
//               <th className="p-3 text-left">Seats</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus) => (
//               <tr key={bus._id} className="border-b">
//                 <td className="p-3">{bus.busName}</td>
//                 <td className="p-3">{bus.routeFrom} to {bus.routeTo}</td>
//                 <td className="p-3">{bus.busType}</td>
//                 <td className="p-3">{bus.availableSeats}/{bus.totalSeats}</td>
//                 <td className="p-3">
//                   <button onClick={() => openEditModal(bus)} className="mr-2 text-blue-600"><Edit size={18} /></button>
//                   <button onClick={() => handleDelete(bus._id)} className="text-red-600"><Trash size={18} /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* মোডাল (অ্যাড/এডিট ফর্ম) */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-lg p-6 bg-white rounded-lg">
//             <h2 className="mb-4 text-2xl font-bold">
//               {isEditing ? "Edit Bus" : "Add New Bus"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input name="busName" value={formData.busName} onChange={handleChange} placeholder="Bus Name (e.g., 05)" className="w-full p-2 border rounded" required />
//               <input name="routeFrom" value={formData.routeFrom} onChange={handleChange} placeholder="Route From" className="w-full p-2 border rounded" required />
//               <input name="routeTo" value={formData.routeTo} onChange={handleChange} placeholder="Route To" className="w-full p-2 border rounded" required />
//               <input name="time" value={formData.time} onChange={handleChange} placeholder="Time (e.g., 03:00 PM)" className="w-full p-2 border rounded" required />
//               <input name="totalSeats" value={formData.totalSeats} onChange={handleChange} type="number" placeholder="Total Seats" className="w-full p-2 border rounded" />
//               <input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver Name" className="w-full p-2 border rounded" />
//               <input name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" className="w-full p-2 border rounded" />
//               <select name="busType" value={formData.busType} onChange={handleChange} className="w-full p-2 border rounded">
//                 <option value="Combined">Combined</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Faculty">Faculty</option>
//               </select>
//               <div className="flex justify-end space-x-3">
//                 <button type="button" onClick={resetModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//                 <button type="submit" className="px-4 py-2 text-white rounded bg-theme-green">{isEditing ? "Update" : "Save"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus, Edit, Trash } from "lucide-react";

// ডিফল্ট ফর্ম স্টেট (✅ আপডেটেড)
const defaultFormState = {
  busName: "",
  routeFrom: "",
  routeTo: "",
  time: "", // e.g., "1:45 PM" (ডিসপ্লের জন্য)
  departureTime: "", // e.g., "13:45" (টাইম ইনপুট থেকে আসবে)
  totalSeats: 40,
  driverName: "",
  driverContact: "",
  busType: "Combined",
};

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);

  // বাস লোড
  const fetchBuses = async () => {
    try {
      // ✅ অ্যাডমিন সব বাস দেখবে (ফিল্টার ছাড়া)
      const res = await instance.get("/admin/buses");
      setBuses(res.data);
    } catch (err) {
      toast.error("Failed to fetch buses");
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await instance.put(`/admin/bus/${currentBus._id}`, formData);
        toast.success("Bus updated successfully");
      } else {
        await instance.post("/admin/bus", formData);
        toast.success("Bus added successfully");
      }
      resetModal();
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save bus");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await instance.delete(`/admin/bus/${id}`);
        toast.success("Bus deleted");
        fetchBuses();
      } catch (err) {
        toast.error("Failed to delete bus");
      }
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentBus(null);
    setFormData(defaultFormState);
  };

  // এডিট মোড (✅ আপডেটেড)
  const openEditModal = (bus) => {
    setFormData({
      busName: bus.busName,
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      time: bus.time,
      departureTime: bus.departureTime, // ✅ নতুন ফিল্ড
      totalSeats: bus.totalSeats,
      driverName: bus.driverName || "",
      driverContact: bus.driverContact || "",
      busType: bus.busType,
    });
    setCurrentBus(bus);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    resetModal();
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bus Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 space-x-2 font-semibold text-white rounded-lg bg-theme-green hover:bg-green-700"
        >
          <Plus size={20} />
          <span>Add New Bus</span>
        </button>
      </div>

      {/* বাস টেবিল (✅ আপডেটেড) */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Bus Name</th>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id} className="border-b">
                <td className="p-3">{bus.busName}</td>
                <td className="p-3">{bus.routeFrom} to {bus.routeTo}</td>
                <td className="p-3">{bus.time} ({bus.departureTime})</td>
                <td className="p-3">{bus.busType}</td>
                <td className="p-3">
                  <button onClick={() => openEditModal(bus)} className="mr-2 text-blue-600"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(bus._id)} className="text-red-600"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মোডাল (অ্যাড/এডিট ফর্ম) (✅ আপডেটেড) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">
              {isEditing ? "Edit Bus" : "Add New Bus"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <input name="busName" value={formData.busName} onChange={handleChange} placeholder="Bus Name (e.g., 05)" className="w-full p-2 border rounded" required />
              <input name="routeFrom" value={formData.routeFrom} onChange={handleChange} placeholder="Route From" className="w-full p-2 border rounded" required />
              <input name="routeTo" value={formData.routeTo} onChange={handleChange} placeholder="Route To" className="w-full p-2 border rounded" required />
              
              {/* ✅ টাইম ইনপুট (দুটি) */}
              <label className="block text-sm">Display Time (e.g., 1:45 PM)</label>
              <input name="time" value={formData.time} onChange={handleChange} placeholder="Display Time (e.g., 1:45 PM)" className="w-full p-2 border rounded" required />
              
              <label className="block text-sm">Departure Time (24-hour format)</label>
              <input name="departureTime" value={formData.departureTime} onChange={handleChange} type="time" placeholder="Departure Time (HH:mm)" className="w-full p-2 border rounded" required />

              <input name="totalSeats" value={formData.totalSeats} onChange={handleChange} type="number" placeholder="Total Seats" className="w-full p-2 border rounded" />
              <input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver Name" className="w-full p-2 border rounded" />
              <input name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" className="w-full p-2 border rounded" />
              <select name="busType" value={formData.busType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Combined">Combined</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Faculty">Faculty</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white rounded bg-theme-green">{isEditing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}