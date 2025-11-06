import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Mail, Phone, ChevronDown } from "lucide-react";

// ✅ HelpCard Component
type HelpCardProps = {
  icon: React.ElementType;
  title: string;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
};

const HelpCard: React.FC<HelpCardProps> = ({
  icon: Icon,
  title,
  iconBg,
  iconColor,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition">
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    </div>

    {children}
  </div>
);

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const guides = [
  {
    title: "How to add a new class",
    content: (
      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
        <li>Go to the <strong>Classes</strong> page from the sidebar.</li>
        <li>Click the <strong>“Add Class”</strong> button on the top-right.</li>
        <li>Enter your class name (e.g., CSI3001).</li>
        <li>Enter the slot (e.g., G1 + TG1).</li>
        <li>Click <strong>“Add”</strong> to save the class.</li>
        <li>Your class will now appear in the classes list.</li>
      </ul>
    ),
  },

  {
    title: "How to add assignments",
    content: (
      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
        <li>Open any class from the <strong>Classes</strong> page.</li>
        <li>Click the <strong>“Add Assignment”</strong> button.</li>
        <li>Enter the assignment title.</li>
        <li>Select the assignment due date.</li>
        <li>Click <strong>Add</strong> to create the assignment.</li>
        <li>You will get reminders based on due date.</li>
      </ul>
    ),
  },

  {
    title: "How to upload answer sheets",
    content: (
      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2 text-sm">
        <li>Navigate to the <strong>Upload</strong> section from the sidebar.</li>
        <li>Click the <strong>“Upload Answer Sheet”</strong> button.</li>
        <li>Upload a scanned image or a PDF file.</li>
        <li>Ensure the handwriting is clear and readable for better accuracy.</li>
        <li>Once uploaded, the platform will begin processing automatically.</li>
      </ul>
    ),
  },

  {
    title: "How grading works (behind the scenes)",
    content: (
      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2 text-sm">
        <li>The uploaded answer sheet is scanned using AI-based OCR.</li>
        <li>The system extracts text from the handwritten/typed sheet.</li>
        <li>
          Evaluation happens
        </li>
        <li>The model checks:</li>
        <ul className="list-disc ml-10 space-y-1">
          <li>Keywords</li>
          <li>Concept correctness</li>
          <li>Explanation clarity</li>
          <li>Grammar & completeness</li>
        </ul>
        <li>Marks are automatically calculated.</li>
        <li>
          You can view detailed results in the <strong>Grading</strong> section.
        </li>
      </ul>
    ),
  },
];


  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          Help & Support
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Get guidance, FAQs, and reach out for assistance
        </p>

        <div className="space-y-6">

          {/* ✅ User Guides */}
          <HelpCard
            icon={BookOpen}
            title="User Guides"
            iconBg="bg-purple-100 dark:bg-purple-900/40"
            iconColor="text-purple-600"
          >
            {guides.map((guide, index) => (
              <div key={index}>
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 
                             border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 
                             text-gray-800 dark:text-gray-200 font-medium text-sm hover:text-purple-600 transition"
                >
                  {guide.title}
                  <ChevronDown
                    className={`transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ✅ Dropdown Content */}
                {openIndex === index && (
                  <div className="mt-2 mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                    {guide.content}
                  </div>
                )}
              </div>
            ))}
          </HelpCard>

          {/* ✅ Contact Support */}
          <HelpCard
            icon={MessageSquare}
            title="Contact Support"
            iconBg="bg-blue-100 dark:bg-blue-900/40"
            iconColor="text-blue-600"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Need help? You can reach us directly through Email or Toll-free support.
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div className="p-4 rounded-lg flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Email
                  </p>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=skillifyy@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-purple-600 dark:text-purple-300 hover:underline"
                  >
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-lg flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm">
                  <Phone size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Toll-Free
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1800-123-4567
                  </p>
                </div>
              </div>
            </div>
          </HelpCard>

        </div>
      </motion.div>
    </div>
  );
}
