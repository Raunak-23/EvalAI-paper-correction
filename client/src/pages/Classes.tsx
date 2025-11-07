// src/pages/Classes.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, ClipboardList } from "lucide-react";
import { useGlobal, ClassType, Assignment } from "../context/GlobalContext";
import { useNotification } from "../context/NotificationContext";

type StatusType = "Completed" | "Ongoing" | "Upcoming";

const isSameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getStatusFromDate = (due: string, completed?: boolean): StatusType => {
  if (completed) return "Completed";
  const today = new Date();
  const dueDate = new Date(due);
  if (isSameYMD(dueDate, today)) return "Ongoing";
  return dueDate > today ? "Upcoming" : "Completed"; // past but not marked = completed by date
};

const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const styles = {
    Completed: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    Ongoing: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200",
    Upcoming: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  } as const;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function Classes() {
  const { classes, addClass, addAssignment, updateAssignmentCompletion } = useGlobal();
  const { addNotification, settings } = useNotification();

  const [showClassPopup, setShowClassPopup] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [className, setClassName] = useState("");
  const [slot, setSlot] = useState("");

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [assignTitle, setAssignTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddClass = () => {
    if (!className.trim() || !slot.trim()) return;
    addClass({ name: className, slot });
    setClassName("");
    setSlot("");
    setShowClassPopup(false);
  };

  const handleAddAssignment = () => {
    if (!assignTitle.trim() || !dueDate.trim() || selectedClassId === null) return;

    // persist with completed=false
    addAssignment(selectedClassId, {
      title: assignTitle,
      due: dueDate,
      completed: false, // make sure your GlobalContext supports this field
    } as Assignment);

    // Notifications respecting settings
    if (settings.reminders) {
      const todayStr = new Date().toISOString().split("T")[0];
      if (dueDate === todayStr) {
        addNotification(`📌 Assignment "${assignTitle}" is due today!`);
      } else if (new Date(dueDate) < new Date(todayStr)) {
        addNotification(`⚠️ Assignment "${assignTitle}" is already overdue!`);
      }
    }

    setAssignTitle("");
    setDueDate("");
    setShowAssignPopup(false);
  };

  const handleToggleComplete = (cls: ClassType, index: number) => {
    const a = cls.assignments[index] as Assignment & { completed?: boolean };
    const wasCompleted = !!a.completed;
    const newCompleted = !wasCompleted;

    updateAssignmentCompletion(cls.id, index, newCompleted);

    if (settings.reminders && newCompleted) {
      // compute on-time / late
      const due = new Date(a.due);
      const today = new Date();
      if (isSameYMD(today, due)) {
        addNotification(`✅ Assignment "${a.title}" completed on time!`);
      } else if (today > due) {
        addNotification(`⚠️ Assignment "${a.title}" was completed late!`);
      } else {
        addNotification(`✅ Assignment "${a.title}" marked as completed!`);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 dark:bg-gray-900 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h1>
            <p className="text-gray-500 dark:text-gray-300">Manage your classes and assignments easily</p>
          </div>

          <button
            onClick={() => setShowClassPopup(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
          >
            <Plus size={18} />
            Add Class
          </button>
        </div>

        <div className="space-y-5">
          {classes.map((cls: ClassType) => (
            <div
              key={cls.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{cls.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{cls.slot}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setShowAssignPopup(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <ClipboardList size={16} />
                  Add Assignment
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {cls.assignments.length === 0 && (
                  <p className="text-gray-400 dark:text-gray-500 italic">No assignments yet.</p>
                )}

                {cls.assignments.map((a: Assignment & { completed?: boolean }, index: number) => {
                  const status = getStatusFromDate(a.due, a.completed);
                  return (
                    <div
                      key={`${a.title}-${index}`}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={!!a.completed}
                          onChange={() => handleToggleComplete(cls, index)}
                          className="mt-1 h-4 w-4 accent-purple-600"
                          title="Mark as complete"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {a.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar size={14} />
                            Due: {a.due}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Class Popup */}
      {showClassPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[350px] shadow-xl border border-gray-300 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Class</h2>

            <input
              className="w-full border px-3 py-2 mb-3 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Class Name (e.g., CSI3001)"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            <input
              className="w-full border px-3 py-2 mb-3 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Slot (e.g., G1 + TG1)"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowClassPopup(false)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded">
                Cancel
              </button>
              <button onClick={handleAddClass} className="px-3 py-1 bg-purple-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Popup */}
      {showAssignPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[350px] shadow-xl border border-gray-300 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Assignment</h2>

            <input
              className="w-full border px-3 py-2 mb-3 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Assignment Title"
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
            />

            <input
              type="date"
              className="w-full border px-3 py-2 mb-3 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAssignPopup(false)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded">
                Cancel
              </button>
              <button onClick={handleAddAssignment} className="px-3 py-1 bg-purple-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
