import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { FaCheck, FaExclamationCircle, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

type AttendanceStatus = "present" | "absent" | "leave" | undefined;

interface Student {
  id: number;
  name: string;
  registrationNo: string;
  status?: AttendanceStatus;
}

interface AttendanceMarkingProps {
  students: Student[];
  date: string;
  onSave: (markedAttendance: {studentId: number, status: AttendanceStatus}[]) => void;
  onClose: () => void;
}

export default function AttendanceMarking({ students, date, onSave, onClose }: AttendanceMarkingProps) {
  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [showUnmarkedOnly, setShowUnmarkedOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize attendance data from provided students
  useEffect(() => {
    setAttendanceData(students.map(student => ({ ...student })));
  }, [students]);
  
  // Handle status change for a student
  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId 
          ? { ...student, status } 
          : student
      )
    );
  };
  
  // Handle save attendance
  const handleSave = () => {
    // Extract the marked attendance data
    const markedAttendance = attendanceData
      .filter(student => student.status !== undefined)
      .map(student => ({
        studentId: student.id,
        status: student.status
      }));
    
    // Check if all students have attendance marked
    const unmarkedCount = attendanceData.filter(student => student.status === undefined).length;
    
    if (unmarkedCount > 0) {
      if (window.confirm(`${unmarkedCount} student(s) have no attendance marked. They will be automatically marked as absent. Continue?`)) {
        onSave(markedAttendance);
        toast.success("Attendance saved successfully!");
      }
    } else {
      onSave(markedAttendance);
      toast.success("Attendance saved successfully!");
    }
  };

  // Filter students based on search and unmarked filter
  const filteredStudents = attendanceData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showUnmarkedOnly) {
      return matchesSearch && student.status === undefined;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mark Attendance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Date: {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showUnmarkedOnly} 
              onChange={() => setShowUnmarkedOnly(!showUnmarkedOnly)} 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show unmarked only</span>
          </label>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FaExclamationCircle className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-500" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">No students to mark</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {showUnmarkedOnly 
                ? "All students have been marked or no students match your search." 
                : "No students match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Registration No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {student.registrationNo}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(student.id, "present")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            student.status === "present"
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900/30"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <FaCheck className="h-3 w-3" />
                            <span>Present</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "leave")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            student.status === "leave"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-yellow-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-yellow-900/30"
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end gap-3">
        <Button
          onClick={onClose}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <FaSave className="h-4 w-4" />
          <span>Save Attendance</span>
        </Button>
      </div>
    </div>
  );
}