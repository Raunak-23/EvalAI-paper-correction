// src/pages/Upload.tsx
import React, { useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, FileUp, File, CheckCheck, Loader2 } from "lucide-react";
import { useGlobal } from "../context/GlobalContext";

/* ----------------------
   ✅ Dropzone Component
----------------------- */
type DropzoneProps = {
  title: string;
  acceptedFormats: string;
  isMultiple: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
};

const Dropzone: React.FC<DropzoneProps> = ({
  title,
  acceptedFormats,
  isMultiple,
  files,
  onFilesSelected,
  disabled = false,
}) => {
  const inputId = `dropzone-${title.replace(/\s/g, "-")}`;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList);
    onFilesSelected(isMultiple ? selected : selected.slice(0, 1));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => !disabled && document.getElementById(inputId)?.click()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
      hover:bg-gray-100 dark:hover:bg-gray-800 transition
      bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div
        className={`p-4 rounded-full mb-4 bg-gradient-to-r 
        ${
          title.includes("Answer Key")
            ? "from-blue-400 to-purple-500"
            : "from-purple-400 to-pink-500"
        } 
        flex items-center justify-center`}
      >
        <Plus size={28} className="text-white" />
      </div>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
        {title}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
        Or <span className="font-semibold text-purple-600">Browse files</span>
      </p>

      <input
        id={inputId}
        type="file"
        multiple={isMultiple}
        accept={acceptedFormats}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      {files.length > 0 && (
        <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-left max-h-24 overflow-y-auto">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ----------------------
   ✅ Tab Button
----------------------- */
type TabButtonProps = {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-semibold transition-all
      ${
        isActive
          ? "bg-purple-600 text-white shadow-md"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

/* ----------------------
   ✅ Main Upload Page
----------------------- */

type ClassOption = { value: string; label: string };

const Upload: React.FC = () => {
  const navigate = useNavigate();

  /* ✅ Fetch classes from GlobalContext */
  const { classes } = useGlobal();

  const classOptions: ClassOption[] = classes.map((cls) => ({
    value: cls.id.toString(),
    label: cls.name,
  }));

  const [mode, setMode] = useState<"bulk" | "single">("bulk");
  const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
  const [studentFiles, setStudentFiles] = useState<File[]>([]);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleStudentFiles = (files: File[]) => {
    setStudentFiles(mode === "single" ? files.slice(0, 1) : files);
    setUploadMessage("");
    setIsError(false);
  };

  const handleAnswerKeyFile = (files: File[]) => {
    if (files.length > 0) setAnswerKeyFile(files[0]);
    setUploadMessage("");
    setIsError(false);
  };

  /* ----------------------
     ✅ Submit Handler
  ----------------------- */
  const handleEvaluate = async () => {
    if (!studentFiles.length || !answerKeyFile) {
      setUploadMessage(
        "Please upload both student paper and answer key files."
      );
      setIsError(true);
      return;
    }

    setProcessing(true);
    setUploadMessage("");
    setIsError(false);

    const formData = new FormData();
    formData.append("student_pdf", studentFiles[0]);
    formData.append("qp_or_key_pdf", answerKeyFile);

    try {
      const response = await axios.post(
        "https://evalai-ml-e9gxard5ace3bycy.centralindia-01.azurewebsites.net/grade",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": "689277",
          },
        }
      );

      const data = response.data;

      navigate("/grading", {
        state: {
          result: data,
          studentPdf: URL.createObjectURL(studentFiles[0]),
        },
      });

      const student = data.student_info || {};

      setUploadMessage(
        `✅ Evaluation complete for ${student.name || "Student"} (${
          student.registration_number || "N/A"
        })`
      );

      setStudentFiles([]);
      setAnswerKeyFile(null);
      setIsError(false);
    } catch (err: any) {
      let msg = "Upload failed due to a server error.";

      if (axios.isAxiosError(err)) {
        if (err.response) msg = `Error ${err.response.status}`;
        else if (err.request) msg = "No response from server (CORS issue)";
        else msg = err.message;
      }

      setUploadMessage(msg);
      setIsError(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-purple-600 dark:text-purple-400">
          Upload
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Upload student answer sheets for evaluation
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Left Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                Select Class
              </p>

              <Select
                options={classOptions}
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder="Select Class"
                isClearable
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Dropzone
              title="Upload Answer Key"
              acceptedFormats=".pdf,.docx,.txt,.csv"
              isMultiple={false}
              files={answerKeyFile ? [answerKeyFile] : []}
              onFilesSelected={handleAnswerKeyFile}
            />

            <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 inline-flex gap-1 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <TabButton
                label="Bulk Upload"
                icon={FileUp}
                isActive={mode === "bulk"}
                onClick={() => {
                  setMode("bulk");
                  setStudentFiles([]);
                }}
              />
              <TabButton
                label="Single File"
                icon={File}
                isActive={mode === "single"}
                onClick={() => {
                  setMode("single");
                  setStudentFiles([]);
                }}
              />
            </div>

            <Dropzone
              title="Upload Student Papers"
              acceptedFormats=".pdf,.jpg,.jpeg,.png"
              isMultiple={mode === "bulk"}
              files={studentFiles}
              onFilesSelected={handleStudentFiles}
            />

            <button
              onClick={handleEvaluate}
              disabled={
                processing ||
                studentFiles.length === 0 ||
                !selectedClass ||
                !answerKeyFile
              }
              className={`w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 mt-4 font-semibold rounded-lg shadow-md text-white transition
                ${
                  processing ||
                  studentFiles.length === 0 ||
                  !selectedClass ||
                  !answerKeyFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
                }`}
            >
              {processing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <CheckCheck size={20} />
              )}
              {processing ? "Evaluating..." : "Evaluate"}
            </button>

            {uploadMessage && (
              <p
                className={`mt-4 text-sm font-semibold ${
                  isError
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Upload;
