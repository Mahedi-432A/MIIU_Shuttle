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
        <PartyPopper size={120} className="mb-8 text-red-500" />

        <h1 className="text-4xl font-bold text-red-500">Congratulations!</h1>
        <p className="mt-4 text-xl text-gray-700">Your Registration Done</p>
        <p className="mt-2 text-lg text-gray-600">
          Thank you for signing up with us!
        </p>
      </div>

      {/* বাটন */}
      <div className="w-full">
        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
}