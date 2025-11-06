// src/pages/Auth.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use AuthContext
  
  const [mode, setMode] = useState<"login" | "register">("login");

  // ✅ Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [department, setDept] = useState("");

  // ✅ Backend URL
  const API_BASE = "http://localhost:5000/api/auth";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        // ✅ Login API
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Login failed");
          return;
        }

        const token = data.data.token;

        // ✅ Save in AuthContext AND localStorage
        login(token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        navigate("/dashboard");
      } else {
        // ✅ Registration API (Teacher only)
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            role: "teacher",
            department,
            subjects: [],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Registration failed");
          return;
        }

        alert("Teacher registered successfully!");
        setMode("login");
      }
    } catch (err) {
      alert("Something went wrong: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        
        {/* ✅ Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br 
              from-purple-500 to-pink-500 flex items-center 
              justify-center text-white text-3xl font-extrabold shadow-md">
              E
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            EvalAI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI-Powered Paper Evaluator
          </p>
        </div>

        {/* ✅ Heading */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">
          {mode === "login" ? "Welcome Back 👋" : "Create Teacher Account"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* ✅ Registration fields */}
          {mode === "register" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 
                             border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-gray-100"
                  value={firstName}
                  onChange={(e) => setFirst(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 
                             border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-gray-100"
                  value={lastName}
                  onChange={(e) => setLast(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 
                             border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-gray-100"
                  value={department}
                  onChange={(e) => setDept(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* ✅ Login + Registration common fields */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 
                         border border-gray-300 dark:border-gray-600 
                         text-gray-900 dark:text-gray-100"
              placeholder="teacher@evalai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 
                         border border-gray-300 dark:border-gray-600 
                         text-gray-900 dark:text-gray-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold 
                       bg-gradient-to-r from-purple-600 to-blue-500 
                       flex items-center justify-center gap-2 shadow-md hover:opacity-90"
          >
            {mode === "login" ? (
              <>
                <LogIn size={18} />
                Login
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </button>
        </form>

        {/* ✅ Switch mode */}
        <p className="mt-5 text-sm text-center text-gray-600 dark:text-gray-400">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                onClick={() => setMode("register")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
