// src/component/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { Bell, Moon, Sun, Trash2, CheckCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [_profileOpen, _setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Refs to detect outside clicks
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notifRef.current &&
        !notifRef.current.contains(target) &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setNotifOpen(false);
        _setProfileOpen(false);
      } else if (
        notifRef.current &&
        !notifRef.current.contains(target) &&
        notifOpen
      ) {
        setNotifOpen(false);
      } else if (
        profileRef.current &&
        !profileRef.current.contains(target) &&
        _profileOpen
      ) {
        _setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, _profileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const [profileName, setProfileName] = useState("D");
  const [_profileEmail, setProfileEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      const p = JSON.parse(saved);
      setProfileName(p.profileName || "D");
      setProfileEmail(p.email || "");
    }
  }, []);

  const _avatarInitial = profileName.charAt(0).toUpperCase();

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
      <div className="flex items-center space-x-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full 
          text-purple-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 
          transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-full 
            text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 
            hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 border 
            border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b 
              border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Notifications
                </p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 p-4">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-between gap-2"
                    >
                      <div>
                        <p
                          className={`text-sm ${
                            n.read
                              ? "text-gray-600 dark:text-gray-300"
                              : "text-gray-900 dark:text-white font-semibold"
                          }`}
                        >
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

        {/* PROFILE AVATAR */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => _setProfileOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-full 
            bg-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            {_avatarInitial}
          </button>

          {_profileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">{_profileEmail}</p>
              <button
                className="text-xs text-red-500 mt-2 hover:underline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
