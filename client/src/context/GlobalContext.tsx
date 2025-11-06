// ✅ src/context/GlobalContext.tsx
import React, { createContext, useContext, useState } from "react";

/* ---------------------------------------------
 ✅ Type Definitions
---------------------------------------------- */

export type Assignment = {
  title: string;
  due: string;
  completed: boolean; // ✅ NEW
};

export type ClassType = {
  id: number;
  name: string;
  slot: string;
  assignments: Assignment[];
};

export type GlobalContextType = {
  classes: ClassType[];
  addClass: (cls: { name: string; slot: string }) => void;
  addAssignment: (classId: number, assignment: Assignment) => void;
  updateAssignmentCompletion: (
    classId: number,
    index: number,
    completed: boolean
  ) => void; // ✅ NEW
};

/* ---------------------------------------------
 ✅ Create Context
---------------------------------------------- */

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* ---------------------------------------------
 ✅ Provider Component
---------------------------------------------- */

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassType[]>([]);

  /* ---------------------------------------------
   ✅ Add New Class
  ---------------------------------------------- */
  const addClass = (cls: { name: string; slot: string }) => {
    setClasses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: cls.name,
        slot: cls.slot,
        assignments: [],
      },
    ]);
  };

  /* ---------------------------------------------
   ✅ Add Assignment
  ---------------------------------------------- */
  const addAssignment = (classId: number, assignment: Assignment) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? { ...cls, assignments: [...cls.assignments, assignment] }
          : cls
      )
    );
  };

  /* ---------------------------------------------
   ✅ Update Assignment Completion (NEW)
  ---------------------------------------------- */
  const updateAssignmentCompletion = (
    classId: number,
    index: number,
    completed: boolean
  ) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              assignments: cls.assignments.map((a, i) =>
                i === index ? { ...a, completed } : a
              ),
            }
          : cls
      )
    );
  };

  /* ---------------------------------------------
   ✅ Provide Context
  ---------------------------------------------- */
  return (
    <GlobalContext.Provider
      value={{
        classes,
        addClass,
        addAssignment,
        updateAssignmentCompletion,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

/* ---------------------------------------------
 ✅ Custom Hook
---------------------------------------------- */
export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used inside GlobalProvider");
  }
  return context;
};
