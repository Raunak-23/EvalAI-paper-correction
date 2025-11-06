// src/pages/Grading.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useLocation } from "react-router-dom";

type Answer = {
  question_number: number;
  marks_awarded: number;
  max_marks: number;
  justification: string;
};

export default function Grading() {
  const location = useLocation();
  const result = location.state?.result;
  const studentPdf = location.state?.studentPdf;

  // ✅ Hooks must be at the top
  const initialAnswers: Answer[] = result?.answers || [];
  const [editableAnswers, setEditableAnswers] = useState<Answer[]>(initialAnswers);
  const [selectedQuestion, setSelectedQuestion] = useState<number>(1);

  const currentIdx = useMemo(
    () =>
      editableAnswers.findIndex((a) => a.question_number === selectedQuestion),
    [editableAnswers, selectedQuestion]
  );

  const currentQ = currentIdx !== -1 ? editableAnswers[currentIdx] : undefined;

  const setMarks = (val: string) => {
    const n = Number(val);
    if (!currentQ) return;
    const clamped = Number.isFinite(n)
      ? Math.max(0, Math.min(n, currentQ.max_marks))
      : 0;

    setEditableAnswers((prev) =>
      prev.map((a) =>
        a.question_number === selectedQuestion ? { ...a, marks_awarded: clamped } : a
      )
    );
  };

  const setJustification = (text: string) => {
    if (!currentQ) return;
    setEditableAnswers((prev) =>
      prev.map((a) =>
        a.question_number === selectedQuestion ? { ...a, justification: text } : a
      )
    );
  };

  const handleSaveLocal = () => {
    const payload = {
      registration_number: result?.student_info?.registration_number,
      course_code: result?.student_info?.course_code,
      updated_answers: editableAnswers.map((a) => ({
        question_number: a.question_number,
        marks: a.marks_awarded,
        max_marks: a.max_marks,
        justification: a.justification,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluation_${payload.registration_number}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ❌ Missing data state
  if (!result) {
    return (
      <div className="p-8 text-red-600 dark:text-red-400 text-lg font-semibold">
        ❌ No grading data found — upload a file first.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          Grading
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Review and adjust AI-generated scores
        </p>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            ["Student Name", result.student_info?.name],
            ["Registration Number", result.student_info?.registration_number],
            ["Course Code", result.student_info?.course_code],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <div className="p-3 bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-lg shadow-sm text-gray-800 dark:text-gray-200">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ✅ PDF Viewer */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:border dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Answer Sheet Preview
            </h2>

            <div className="bg-gray-100 dark:bg-gray-700 min-h-[70vh] rounded-lg flex justify-center">
              {studentPdf ? (
                <embed
                  src={studentPdf}
                  type="application/pdf"
                  width="100%"
                  height="800px"
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-300 mt-10">
                  No preview available
                </p>
              )}
            </div>
          </div>

          {/* ✅ Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Question Dropdown */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg dark:border dark:border-gray-700">
              <label className="font-semibold text-gray-800 dark:text-gray-200">
                Question -
              </label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
                className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 mt-2 w-full"
              >
                {editableAnswers.map((q) => (
                  <option key={q.question_number} value={q.question_number}>
                    Q{q.question_number}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Marks */}
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-5 rounded-xl shadow-sm">
              <p className="text-sm text-green-800 dark:text-green-300">
                AI suggested score
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 my-1">
                {currentQ ? `${currentQ.marks_awarded}/${currentQ.max_marks}` : "--/--"}
              </p>
            </div>

            {/* Adjust Marks */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Adjust Marks
              </label>
              <input
                type="number"
                value={currentQ?.marks_awarded ?? ""}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 mt-1"
              />
            </div>

            {/* Justification */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                AI Feedback
              </label>
              <textarea
                rows={6}
                value={currentQ?.justification ?? ""}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 mt-1"
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSaveLocal}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:opacity-90"
            >
              <Save size={18} />
              Save (Download JSON)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
