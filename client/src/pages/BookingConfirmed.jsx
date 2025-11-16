import { useNavigate } from "react-router-dom";
// import { CheckCheck } from "lucide-react"; 
// import Confirm-Icon from "../assets/icons and logo/confirm.png";
import ConfirmIcon from "../assets/icons and logo/confirm.png";

export default function BookingConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-between pb-28 items-center p-8 bg-[#fcf8f0]">
      {/* উপরের খালি অংশ */}
      <div></div>

      {/* মাঝের কন্টেন্ট */}
      <div className="flex flex-col items-center text-center">
        {/* আইকন (আপনার ছবির বদলে) */}
        <div className="flex items-center justify-center w-32 h-32 mb-8">
          {/* <CheckCheck size={80} className="text-white" /> */}
          <img className="w-full" src={ConfirmIcon} alt="confirm icon" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Your booking has been
        </h1>
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          confirmed successfully!
        </h1>
      </div>

      {/* বাটন */}
      <div className="w-full">
        <button
          onClick={() => navigate("/home")}
          className="w-full py-4 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-lg"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}