// src/components/student/PersonalDetails.jsx
import React from 'react';

function PersonalDetails({ student }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{student.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Student ID</p>
          <p className="font-medium">{student.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="font-medium">{student.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium">{student.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-medium">{student.department}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Enrollment Date</p>
          <p className="font-medium">{student.enrollmentDate}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
