import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bus,
  LayoutDashboard,
  LogOut,
  Menu,
  FileText,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end // 'end' prop ensures exact match for '/'
    className={({ isActive }) =>
      `flex items-center space-x-3 rounded-md p-2 font-medium ${
        isActive
          ? "bg-theme-yellow text-gray-900"
          : "text-white hover:bg-green-700"
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-theme-green text-white">
      <div className="flex items-center justify-between border-b border-green-700 p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white md:hidden"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <NavItem to="/" icon={<LayoutDashboard size={20} />}>
          Dashboard
        </NavItem>
        <NavItem to="/buses" icon={<Bus size={20} />}>
          Bus Management
        </NavItem>
        <NavItem to="/notices" icon={<FileText size={20} />}>
          Notices
        </NavItem>
      </nav>
      <div className="border-t border-green-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-md p-2 font-medium text-white hover:bg-green-700"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen">
      {/* Mobile Sidebar (Off-canvas) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden w-64 md:block">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 md:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold md:hidden">Admin Panel</h1>
          <span className="font-medium">Welcome, Admin!</span>
        </header>
        <main className="p-6">
          <Outlet /> {/* এখানে পেজগুলো রেন্ডার হবে */}
        </main>
      </div>
    </div>
  );
}