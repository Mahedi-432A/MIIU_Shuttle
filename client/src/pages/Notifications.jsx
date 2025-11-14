// import { useEffect, useState } from "react";
// import instance from "../utils/axiosConfig";
// import { Loader2, Bell } from "lucide-react";

// export default function Notifications() {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotices = async () => {
//       try {
//         // সব নোটিশ লোড করুন (ব্যাকএন্ড নতুনগুলো আগে পাঠাবে)
//         const res = await instance.get("/notices");
//         setNotices(res.data);
//       } catch (err) {
//         console.error("Failed to fetch notices", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotices();
//   }, []);

//   return (
//     <div className="min-h-screen pb-24 bg-theme-bg"> {/* বটম ন্যাভবারের জন্য প্যাডিং */}
//       <div className="p-6">
//         <h1 className="flex items-center mb-6 text-3xl font-bold text-gray-800">
//           <Bell className="mr-2 text-theme-green" /> Notifications
//         </h1>

//         {loading ? (
//           <div className="flex justify-center mt-20">
//             <Loader2 className="animate-spin text-theme-green" size={40} />
//           </div>
//         ) : notices.length === 0 ? (
//           <p className="mt-10 text-center text-gray-500">
//             No notifications yet.
//           </p>
//         ) : (
//           <div className="space-y-4">
//             {notices.map((notice) => (
//               <div
//                 key={notice._id}
//                 className="p-4 bg-white border rounded-lg shadow"
//               >
//                 <h2 className="text-lg font-bold text-theme-green">
//                   {notice.title}
//                 </h2>
//                 <p className="my-2 text-gray-700 whitespace-pre-wrap">
//                   {notice.content}
//                 </p>
//                 <small className="text-gray-400">
//                   {new Date(notice.createdAt).toLocaleString()}
//                 </small>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import { Loader2, Bell } from "lucide-react";
import { socket } from "../utils/socket"; // ✅ Socket.io ইম্পোর্ট

export default function Notifications() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // সব নোটিশ লোড করুন (ব্যাকএন্ড নতুনগুলো আগে পাঠাবে)
        const res = await instance.get("/notices");
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();

    // ✅ নতুন নোটিশের জন্য সকেট লিসেনার সেট করুন
    socket.on("newNotice", (newNotice) => {
      console.log("New notice added to list:", newNotice);
      // নতুন নোটিশটি তালিকার প্রথমে যোগ করুন
      setNotices((prevNotices) => [newNotice, ...prevNotices]);
    });

    // ✅ কম্পোনেন্ট আনমাউন্ট হলে লিসেনার ক্লিন আপ করুন
    return () => {
      socket.off("newNotice");
    };
  }, []); // এই useEffect একবারই রান হবে

  return (
    <div className="min-h-screen pb-24 bg-theme-bg"> {/* ✅ কালার থিম আপডেট */}
      <div className="p-6">
        <h1 className="flex items-center mb-6 text-3xl font-bold text-gray-800">
          <Bell className="mr-2 text-theme-green" /> Notifications
        </h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-theme-green" size={40} />
          </div>
        ) : notices.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="p-4 bg-white border rounded-lg shadow"
              >
                <h2 className="text-lg font-bold text-theme-green">
                  {notice.title}
                </h2>
                <p className="my-2 text-gray-700 whitespace-pre-wrap">
                  {notice.content}
                </p>
                <small className="text-gray-400">
                  {new Date(notice.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}