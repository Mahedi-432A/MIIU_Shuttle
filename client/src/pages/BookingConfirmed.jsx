import { useNavigate } from "react-router-dom";
import { CheckCheck } from "lucide-react"; 

export default function BookingConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-between items-center p-8 bg-[#fcf8f0]">
      {/* উপরের খালি অংশ */}
      <div></div>

      {/* মাঝের কন্টেন্ট */}
      <div className="flex flex-col items-center text-center">
        {/* আইকন (আপনার ছবির বদলে) */}
        <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mb-8">
          <CheckCheck size={80} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Your booking has been
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          confirmed successfully!
        </h1>
      </div>

      {/* বাটন */}
      <div className="w-full">
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-yellow-400 text-gray-900 py-4 rounded-lg text-lg font-semibold shadow-lg"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}