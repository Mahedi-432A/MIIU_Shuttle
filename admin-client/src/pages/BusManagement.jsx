import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus, Edit, Trash, X, Search, Filter } from "lucide-react";

// Default Form State
const defaultFormState = {
  busName: "",
  routeFrom: "",
  routeTo: "",
  departureTime: "", // e.g., "13:45" (input)
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load Buses
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/admin/buses");
      setBuses(res.data);
    } catch (err) {
      toast.error("Failed to fetch buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Lock Body Scroll When Modal is Open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate Display Time from Departure Time (24h -> 12h AM/PM)
      let displayTime = "";
      if (formData.departureTime) {
        const [hours, minutes] = formData.departureTime.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        displayTime = `${h12}:${minutes} ${ampm}`;
      }

      const payload = { ...formData, time: displayTime };

      if (isEditing) {
        await instance.put(`/admin/bus/${currentBus._id}`, payload);
        toast.success("Bus updated successfully");
      } else {
        await instance.post("/admin/bus", payload);
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

  const openEditModal = (bus) => {
    setFormData({
      busName: bus.busName,
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      departureTime: bus.departureTime || "",
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

  // Filter Buses
  const filteredBuses = buses.filter((bus) =>
    bus.busName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.routeFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.routeTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bus Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage fleet, routes, and schedules.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" />
          Add New Bus
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search buses by name or route..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
        </div>
        <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <Filter size={16} className="mr-2 text-gray-500" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bus Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Schedule</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading buses...
                  </td>
                </tr>
              ) : filteredBuses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                    {searchQuery ? "No buses found matching your search." : "No buses found. Add one to get started."}
                  </td>
                </tr>
              ) : (
                filteredBuses.map((bus) => (
                  <tr key={bus._id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-primary">
                          <span className="font-bold">{bus.busName}</span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">Bus {bus.busName}</div>
                          <div className="text-sm text-gray-500">{bus.driverName || "No Driver"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{bus.routeFrom}</div>
                      <div className="text-xs text-gray-500">to {bus.routeTo}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                         {bus.time || bus.departureTime}
                       </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bus.busType === 'Female' ? 'bg-pink-100 text-pink-800' :
                        bus.busType === 'Male' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {bus.busType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(bus)} 
                          className="rounded p-1 text-green-600 hover:bg-green-50 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(bus._id)} 
                          className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Fixed Overlay & Z-Index */}
      {showModal && (
        <div className="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity backdrop-blur-sm"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {isEditing ? "Edit Bus Details" : "Add New Bus"}
                    </h3>
                    <button onClick={resetModal} className="text-gray-400 hover:text-gray-500">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                         <label className="block text-sm font-medium text-gray-700">Bus Name / No.</label>
                         <input name="busName" value={formData.busName} onChange={handleChange} placeholder="e.g. 05" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" required />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Origin</label>
                        <input name="routeFrom" value={formData.routeFrom} onChange={handleChange} placeholder="From" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Destination</label>
                         <input name="routeTo" value={formData.routeTo} onChange={handleChange} placeholder="To" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" required />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                        <input name="departureTime" type="time" value={formData.departureTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" required />
                        <p className="mt-1 text-xs text-gray-500">Will be displayed as AM/PM automatically.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seats</label>
                        <input name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="busType" value={formData.busType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2">
                          <option value="Combined">Combined</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Faculty">Faculty</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                        <input name="driverName" value={formData.driverName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2" />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                      >
                        {isEditing ? "Update Bus" : "Save Bus"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={resetModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}