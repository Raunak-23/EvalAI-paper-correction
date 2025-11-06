// src/component/Header.tsx
import React, { useState, useEffect } from "react";
import { Bell, Moon, Sun, Trash2, CheckCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleString();
};

const Header: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    markAllRead,
    clearAll,
    removeNotification,
  } = useNotification();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ Profile Data Load from localStorage
  const [profileName, setProfileName] = useState("D");
  const [profileEmail, setProfileEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      const p = JSON.parse(saved);
      setProfileName(p.profileName || "D");
      setProfileEmail(p.email || "");
    }
  }, []);

  // ✅ Initial Letter
  const avatarInitial = profileName.charAt(0).toUpperCase();

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm flex justify-between items-center px-6 py-3 transition-all relative">
      
      {/* LEFT LOGO */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
        w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md">
          E
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Eval AI</h1>
          <p className="text-xs text-gray-500 dark:text-gray-300">AI-Powered Paper Evaluator</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-6">

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="text-purple-600 dark:text-yellow-400 hover:opacity-80 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* NOTIFICATION BELL */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 border 
            border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">

              <div className="flex items-center justify-between px-4 py-2 border-b 
              border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-gray-100 
                    dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
                  >
                    <CheckCheck size={14} /> Read all
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-red-50 
                    dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:opacity-90"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-between gap-2"
                    >
                      <div>
                        <p className={`text-sm ${n.read ? "text-gray-600 dark:text-gray-300" : 
                          "text-gray-900 dark:text-white font-semibold"}`}>
                          {n.message}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">
                          {formatTime(n.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
