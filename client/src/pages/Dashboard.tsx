import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* Title */}
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
        >
          Welcome back
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let’s see what is happening in there
        </p>

        {/* MAIN CARD */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <Sparkles
              size={48}
              className="text-purple-600 dark:text-purple-400 drop-shadow"
            />
          </div>

          {/* Tagline */}
          <p className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
            From manual checking to machine precision —{" "}
            <span className="text-purple-600 dark:text-purple-400">
              evaluate smarter.
            </span>
          </p>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Upload answer sheets, generate AI-evaluated marks, and refine them
            effortlessly with our automated grading engine designed for
            accuracy and speed.
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
