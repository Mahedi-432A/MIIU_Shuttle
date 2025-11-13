import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus, Edit, Trash } from "lucide-react";

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [formData, setFormData] = useState({
    busName: "",
    routeFrom: "",
    routeTo: "",
    time: "",
    totalSeats: 40,
    driverName: "",
    driverContact: "",
    busType: "Combined",
  });

  // বাস লোড
  const fetchBuses = async () => {
    try {
      const res = await instance.get("/admin/buses");
      setBuses(res.data);
    } catch (err) {
      toast.error("Failed to fetch buses");
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // ফর্ম হ্যান্ডেল
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // সাবমিট (অ্যাড/এডিট)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // আপডেট
        await instance.put(`/admin/bus/${currentBus._id}`, formData);
        toast.success("Bus updated successfully");
      } else {
        // নতুন অ্যাড
        await instance.post("/admin/bus", formData);
        toast.success("Bus added successfully");
      }
      resetModal();
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save bus");
    }
  };

  // ডিলিট
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

  // মোডাল রিসেট
  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentBus(null);
    setFormData({
      busName: "", routeFrom: "", routeTo: "", time: "",
      totalSeats: 40, driverName: "", driverContact: "", busType: "Combined",
    });
  };

  // এডিট মোড চালু
  const openEditModal = (bus) => {
    setFormData({
      busName: bus.busName,
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      time: bus.time,
      totalSeats: bus.totalSeats,
      driverName: bus.driverName || "",
      driverContact: bus.driverContact || "",
      busType: bus.busType,
    });
    setCurrentBus(bus);
    setIsEditing(true);
    setShowModal(true);
  };

  // অ্যাড মোড চালু
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
          className="flex items-center space-x-2 rounded-lg bg-theme-green px-4 py-2 font-semibold text-white hover:bg-green-700"
        >
          <Plus size={20} />
          <span>Add New Bus</span>
        </button>
      </div>

      {/* বাস টেবিল (রেসপন্সিভ) */}
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Bus Name</th>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id} className="border-b">
                <td className="p-3">{bus.busName}</td>
                <td className="p-3">{bus.routeFrom} to {bus.routeTo}</td>
                <td className="p-3">{bus.busType}</td>
                <td className="p-3">{bus.availableSeats}/{bus.totalSeats}</td>
                <td className="p-3">
                  <button onClick={() => openEditModal(bus)} className="mr-2 text-blue-600"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(bus._id)} className="text-red-600"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মোডাল (অ্যাড/এডিট ফর্ম) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">
              {isEditing ? "Edit Bus" : "Add New Bus"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="busName" value={formData.busName} onChange={handleChange} placeholder="Bus Name (e.g., 05)" className="w-full rounded border p-2" required />
              <input name="routeFrom" value={formData.routeFrom} onChange={handleChange} placeholder="Route From" className="w-full rounded border p-2" required />
              <input name="routeTo" value={formData.routeTo} onChange={handleChange} placeholder="Route To" className="w-full rounded border p-2" required />
              <input name="time" value={formData.time} onChange={handleChange} placeholder="Time (e.g., 03:00 PM)" className="w-full rounded border p-2" required />
              <input name="totalSeats" value={formData.totalSeats} onChange={handleChange} type="number" placeholder="Total Seats" className="w-full rounded border p-2" />
              <input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver Name" className="w-full rounded border p-2" />
              <input name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" className="w-full rounded border p-2" />
              <select name="busType" value={formData.busType} onChange={handleChange} className="w-full rounded border p-2">
                <option value="Combined">Combined</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Faculty">Faculty</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetModal} className="rounded bg-gray-200 px-4 py-2">Cancel</button>
                <button type="submit" className="rounded bg-theme-green px-4 py-2 text-white">{isEditing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}