// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../constext/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Booking() {
//   const [buses, setBuses] = useState([]);
//   const { token } = useAuth();

//   useEffect(() => {
//     const fetchBuses = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/buses");
//         setBuses(res.data);
//       } catch (err) {
//         console.error("Error loading buses:", err);
//       }
//     };
//     fetchBuses();
//   }, []);

//   const navigate = useNavigate();

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">
//         Available Buses
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {buses.map((bus) => (
//           <div
//             key={bus._id}
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
//           >
//             <h2 className="text-xl font-semibold">{bus.busName}</h2>
//             <p className="text-gray-600">
//               {bus.routeFrom} → {bus.routeTo}
//             </p>
//             <p className="text-sm text-gray-500">🕒 {bus.time}</p>
//             <p className="text-sm text-gray-500">
//               Seats Left: {bus.availableSeats}
//             </p>
//             <button
//               className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
//               // onClick={() => alert(`Bus selected: ${bus.busName}`)}
//               onClick={() => navigate("/seat-selection", { state: { bus } })}
//             >
//               Select Bus
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
// ⭐️ পরিবর্তন: utils থেকে আপনার instance ইম্পোর্ট করুন
import instance from "../utils/axiosConfig"; 
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const [buses, setBuses] = useState([]);
  
  // ❌ const { token } = useAuth(); (আর দরকার নেই)

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // ⭐️ পরিবর্তন: 'instance' ব্যবহার করুন
        const res = await instance.get("/buses"); 
        setBuses(res.data);
      } catch (err) {
        console.error("Error loading buses:", err);
      }
    };
    fetchBuses();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Available Buses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => (
          <div
            key={bus._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{bus.busName}</h2>
            <p className="text-gray-600">
              {bus.routeFrom} → {bus.routeTo}
            </p>
            <p className="text-sm text-gray-500">🕒 {bus.time}</p>
            <p className="text-sm text-gray-500">
              Seats Left: {bus.availableSeats}
            </p>
            <button
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => navigate("/seat-selection", { state: { bus } })}
            >
              Select Bus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}