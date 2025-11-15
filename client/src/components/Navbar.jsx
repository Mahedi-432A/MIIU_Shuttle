import { NavLink, useLocation } from "react-router-dom";
import { Home, CalendarDays, History, Bell, Menu } from "lucide-react";
import { useAuth } from "../constext/AuthContext";

// NavItem Component
const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  // এই পেজগুলোতে ন্যাভবার দেখাবে না
  const hideOnPages = ["/", "/login", "/register", "/signup-success"];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full ${
          isActive ? "text-theme-green" : "text-gray-400"
        }`
      }
    >
      {icon}
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // এই পেজগুলোতে ন্যাভবার দেখাবে না
  const hideOnPages = ["/", "/login", "/register", "/signup-success"];
  if (hideOnPages.includes(location.pathname) || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="bg-white h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl flex justify-around items-center">
        <NavItem to="/home" icon={<Home size={24} />} label="Home" />
        <NavItem to="/my-bookings" icon={<CalendarDays size={24} />} label="Bookings" />
        <NavItem to="#" icon={<History size={24} />} label="History" />
        <NavItem to="/notifications" icon={<Bell size={24} />} label="Notice" />
        {/* <NavItem to="/profile" icon={<Menu size={24} />} label="Menu" /> */}
        <NavItem to="/more" icon={<Menu size={24} />} label="Menu" />
      </div>
    </div>
  );
}