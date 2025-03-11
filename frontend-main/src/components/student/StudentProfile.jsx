// src/components/student/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PersonalDetails from './PersonalDetails';
import SubjectsEnrolled from './SubjectsEnrolled';
import AttendanceHistory from './AttendanceHistory';
import StudentResults from './StudentResults';
import FinesDues from './FinesDues';

function StudentProfile({ students }) {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const foundStudent = students.find(s => s.id === id);
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [id, students]);

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Student not found</h2>
        <p className="mt-2 text-gray-500">The student with ID {id} could not be found.</p>
        <Link to="/search" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Back to Student Search
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
            <img src={student.imageUrl} alt={student.name} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-gray-500">{student.id} · {student.department}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">
            Edit Profile
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Contact Student
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'attendance'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('fines')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fines'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fines & Dues
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <PersonalDetails student={student} />
          <SubjectsEnrolled subjects={student.subjects} />
        </div>
      )}

      {activeTab === 'attendance' && (
        <AttendanceHistory attendance={student.attendanceHistory} />
      )}

      {activeTab === 'results' && (
        <StudentResults subjects={student.subjects} />
      )}

      {activeTab === 'fines' && (
        <FinesDues fines={student.fines} />
      )}
    </div>
  );
}

export default StudentProfile;