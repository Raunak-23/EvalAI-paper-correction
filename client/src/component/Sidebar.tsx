import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  UploadCloud,
  FileText,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", to: "/dashboard", icon: <Home className="w-5 h-5 mr-3" /> },
    { name: "Classes", to: "/classes", icon: <Layers className="w-5 h-5 mr-3" /> },
    { name: "Upload", to: "/upload", icon: <UploadCloud className="w-5 h-5 mr-3" /> },
    { name: "Grading", to: "/grading", icon: <FileText className="w-5 h-5 mr-3" /> },
    { name: "Settings", to: "/settings", icon: <Settings className="w-5 h-5 mr-3" /> },
    { name: "Help", to: "/help", icon: <HelpCircle className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div
      className="
        bg-white 
        dark:bg-gray-800 
        dark:text-white
        shadow-lg 
        flex flex-col 
        justify-between 
        min-h-screen 
        px-2 py-4
      "
      style={{ width: "210px" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          EvalAI
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `
              flex items-center px-4 py-3 rounded-xl transition-all duration-200 
              ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
              `
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={logout}
          className="
            w-full flex items-center justify-center 
            bg-red-500 text-white py-2.5 rounded-xl 
            hover:bg-red-600 transition-all duration-200
          "
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
