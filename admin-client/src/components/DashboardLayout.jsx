import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bus,
  LayoutDashboard,
  LogOut,
  Menu,
  FileText,
  X,
  Bell,
  Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end // 'end' prop ensures exact match for '/'
    className={({ isActive }) =>
      `group flex items-center space-x-3 rounded-lg px-3 py-2.5 font-medium transition-all ${
        isActive
          ? "bg-white/10 text-white shadow-sm"
          : "text-indigo-100 hover:bg-white/5 hover:text-white"
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
    <div className="flex h-full flex-col bg-primary text-white">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Bus size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">MIU Shuttle</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1 text-indigo-100 hover:bg-white/10 md:hidden"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="px-6 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Menu</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
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

      <div className="border-t border-indigo-700/50 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-lg p-2.5 font-medium text-indigo-100 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar (Off-canvas) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform shadow-xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar Placeholder */}
      <div className="hidden w-64 shrink-0 md:block"></div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:ml-4 md:flex md:items-center">
             {/* Breadcrumb legacy or title could go here if needed */}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
               <Search size={20} />
             </button>
             <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
               <Bell size={20} />
               <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
             </button>
             <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
               A
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}