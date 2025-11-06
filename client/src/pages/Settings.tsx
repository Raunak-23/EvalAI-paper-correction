// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Pencil } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

type TabKey = "account" | "notifications";

const TabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-semibold transition-all
      ${
        isActive
          ? "bg-purple-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const SettingsInput = ({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>

    <div className="relative">
      <input
        id={id}
        {...props}
        className="w-full p-3 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
                 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100"
      />
      {!props.disabled && props.type !== "password" && (
        <Pencil
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 cursor-pointer"
        />
      )}
    </div>
  </div>
);

const ToggleSwitch = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 
      ${enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
  >
    <span
      aria-hidden="true"
      className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition
      ${enabled ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const { settings, updateSettings } = useNotification();
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [email, setEmail] = useState('');

  useEffect(() => {
     const storedUser = localStorage.getItem('user');
     if (storedUser) {
       const parsedUser = JSON.parse(storedUser);
       setUser(parsedUser);
       setEmail(parsedUser.email);
     }
   }, []);

  // ✅ values from local storage
  const profileName = `${user.firstName} ${user.lastName}`;

  const handleSaveProfile = async() => {
    // Assumes your user object is in a state variable named 'user'
    if (!user) return;

    try{
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: email })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to update profile');
        return;
      }

      // IMPORTANT: Update user data in local storage and state
      const updatedUser = { ...user, email: data.data.user.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser); // assuems you have a setUser function

      alert('Profile updated successfully');
    } catch(err) {
      console.error('Save profile error:', err);
      alert('An error occurred while saving your profile.');
    }
        
  };

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Manage your account and preferences
        </p>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 inline-flex gap-1 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <TabButton
            label="Account"
            icon={User}
            isActive={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />
          <TabButton
            label="Notifications"
            icon={Bell}
            isActive={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 
                                flex items-center justify-center text-white text-4xl font-medium">
                  S
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput
                  label="Name"
                  id="profileName"
                  value={profileName}
                  disabled
                />

                <SettingsInput
                  label="Email ID"
                  id="email"
                  type="email"
                  className="md:col-span-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // This should be your state setter
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                             rounded-lg shadow-md font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Assignment Reminders
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due Today / Completed on time / Completed late
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.reminders}
                  setEnabled={(v: boolean) =>
                    updateSettings({ reminders: v })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
