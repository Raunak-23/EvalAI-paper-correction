// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Grading from "./pages/Grading";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import SettingsPage from "./pages/Settings";
import Help from "./pages/Help";
import AuthPage from "./pages/Auth";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import ProtectedRoute from "./component/ProtectedRoute";

import { GlobalProvider } from "./context/GlobalContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";


/* ✅ Layout for all logged-in pages */
const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col transition-colors duration-300">
        <Header />
        <div className="flex-1 p-6 text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


/* ✅ Page transitions */
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ✅ Public login page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ Default redirect to /auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* ✅ Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* ✅ Catch-all redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AnimatePresence>
  );
};


/* ✅ Wrap everything inside Providers */
export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <GlobalProvider>
          <ThemeProvider>
            <Router>
              <AnimatedRoutes />
            </Router>
          </ThemeProvider>
        </GlobalProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
