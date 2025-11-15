import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
  Shield,
  HelpCircle,
  MessageSquare,
  FileText,
  Star,
  ToggleLeft,
} from "lucide-react";

// হেলপার কম্পোনেন্ট (মেনু আইটেম)
const MenuItem = ({ icon, text, to, isToggle }) => {
  const navigate = useNavigate();
  const content = (
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex items-center space-x-4">
        {icon}
        <span className="text-lg text-gray-800">{text}</span>
      </div>
      {isToggle ? (
        <ToggleLeft size={30} className="text-gray-300" />
      ) : (
        <ChevronRight size={24} className="text-gray-400" />
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block bg-white rounded-lg shadow">
        {content}
      </Link>
    );
  }
  return (
    <button
      onClick={() => !isToggle && alert("Feature coming soon!")}
      className="block w-full bg-white rounded-lg shadow"
    >
      {content}
    </button>
  );
};

export default function More() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pb-24 bg-theme-bg">
      {/* হেডার */}
      <header className="flex items-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2"
        >
          <ChevronLeft size={28} className="text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-center text-gray-800 grow">
          More
        </h1>
      </header>

      {/* মেনু লিস্ট */}
      <div className="p-6 space-y-6">
        {/* প্রোফাইল লিঙ্ক */}
        <MenuItem
          icon={<User size={24} className="text-theme-green" />}
          text="Profile"
          to="/profile"
        />
        
        {/* App Settings */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            App Settings
          </h2>
          <div className="space-y-2">
            <MenuItem
              icon={<Globe size={24} className="text-theme-green" />}
              text="Language"
            />
            <MenuItem
              icon={<Shield size={24} className="text-theme-green" />}
              text="Privacy and Security"
            />
            <MenuItem
              icon={<ToggleLeft size={24} className="text-theme-green" />}
              text="Show notification"
              isToggle={true}
            />
          </div>
        </section>

        {/* Help & Feedback */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            Help & Feedback
          </h2>
          <div className="space-y-2">
            <MenuItem
              icon={<HelpCircle size={24} className="text-theme-green" />}
              text="Help"
            />
            <MenuItem
              icon={<MessageSquare size={24} className="text-theme-green" />}
              text="Send Feedback"
            />
            <MenuItem
              icon={<FileText size={24} className="text-theme-green" />}
              text="About App"
            />
          </div>
        </section>

        {/* Legal & Policies */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            Legal & Policies
          </h2>
          <div className="space-y-2">
            <MenuItem
              icon={<FileText size={24} className="text-theme-green" />}
              text="Legal & Policies"
            />
            <MenuItem
              icon={<Star size={24} className="text-theme-green" />}
              text="Rate This App"
            />
          </div>
        </section>
      </div>
    </div>
  );
}