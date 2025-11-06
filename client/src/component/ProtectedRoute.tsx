// src/component/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");

  // ✅ If no token → go to login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Token exists → allow page
  return <>{children}</>;
};

export default ProtectedRoute;
