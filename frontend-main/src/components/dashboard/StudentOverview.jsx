// src/components/dashboard/StudentOverview.jsx
import React from 'react';
import StatCard from './StatCard';
import PerformanceChart from './PerformanceChart';
import AttendanceChart from './AttendanceChart';
import { dashboardSummary, students } from '../../data/mockData';

function StudentOverview() {
  // Calculate total unpaid fines
  const unpaidFines = students.reduce((total, student) => {
    const studentUnpaidFines = student.fines
      .filter(fine => fine.status === 'unpaid')
      .reduce((sum, fine) => sum + fine.amount, 0);
    return total + studentUnpaidFines;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Overview Dashboard</h1>
        <div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={dashboardSummary.totalStudents} 
          icon="👥" 
          color="border-blue-500" 
        />
        <StatCard 
          title="Average Attendance" 
          value={`${dashboardSummary.averageAttendance}%`} 
          icon="📋" 
          color="border-green-500" 
        />
        <StatCard 
          title="Average Performance" 
          value={`${dashboardSummary.averagePerformance}%`} 
          icon="📊" 
          color="border-purple-500" 
        />
        <StatCard 
          title="Unpaid Fines" 
          value={`$${unpaidFines}`} 
          icon="💵" 
          color="border-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <AttendanceChart />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${student.performance}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{student.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentOverview;