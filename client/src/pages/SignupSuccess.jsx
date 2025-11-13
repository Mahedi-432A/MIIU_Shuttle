import { useNavigate } from "react-router-dom";
import { PartyPopper } from "lucide-react"; // কনফেটি আইকন 

export default function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-between items-center p-8 bg-[#fcf8f0]">
      {/* উপরের খালি অংশ */}
      <div></div>

      {/* মাঝের কন্টেন্ট */}
      <div className="flex flex-col items-center text-center">
        {/* আইকন (আপনার ছবির বদলে) */}
        <PartyPopper size={120} className="text-red-500 mb-8" />

        <h1 className="text-4xl font-bold text-red-500">Congratulations!</h1>
        <p className="text-xl text-gray-700 mt-4">Your Verification Done</p>
        <p className="text-lg text-gray-600 mt-2">
          Thank you for signing up with us!
        </p>
      </div>

      {/* বাটন */}
      <div className="w-full">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold shadow-lg"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
}