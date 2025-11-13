import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CalendarCheck2,
  History,
  Bell,
  Menu,
} from "lucide-react";

// একটি আইকন কম্পোনেন্ট
const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center space-y-1 ${
        isActive ? "text-green-600" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

// ডামি আইকন কম্পোনেন্ট (নন-ফাংশনাল)
const DummyNavItem = ({ icon, label }) => {
  return (
    <button
      disabled
      className="flex flex-col items-center justify-center space-y-1 text-gray-400 cursor-not-allowed"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] flex justify-around items-center z-50">
      <NavItem to="/home" icon={<Home size={24} />} label="Home" />
      <NavItem
        to="/my-bookings"
        icon={<CalendarCheck2 size={24} />}
        label="Bookings"
      />
      <DummyNavItem icon={<History size={24} />} label="History" />
      <DummyNavItem icon={<Bell size={24} />} label="Notify" />
      <NavItem to="/profile" icon={<Menu size={24} />} label="Menu" />
    </nav>
  );
}