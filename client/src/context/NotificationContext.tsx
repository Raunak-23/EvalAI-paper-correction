// src/context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type NotificationItem = {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
};

type NotificationSettings = {
  // single toggle as per Option A
  reminders: boolean; // controls assignment reminders
};

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (message: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  settings: NotificationSettings;
  updateSettings: (partial: Partial<NotificationSettings>) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

const NOTIF_KEY = "evalai_notifications";
const NOTIF_SETTINGS_KEY = "evalai_notification_settings";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const raw = localStorage.getItem(NOTIF_SETTINGS_KEY);
      return raw ? (JSON.parse(raw) as NotificationSettings) : { reminders: true };
    } catch {
      return { reminders: true };
    }
  });

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addNotification = (message: string) => {
    const item: NotificationItem = {
      id: crypto.randomUUID(),
      message,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [item, ...prev].slice(0, 50)); // keep latest 50
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const updateSettings = (partial: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    removeNotification,
    clearAll,
    settings,
    updateSettings,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};
