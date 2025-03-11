// src/components/dashboard/PerformanceChart.jsx
import React from 'react';
import { students } from '../../data/mockData';

function PerformanceChart() {
  // In a real app, you'd use a proper chart library like recharts
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Student Performance</h2>
      <div className="h-64 flex items-end space-x-6 mt-4">
        {students.slice(0, 5).map((student) => (
          <div key={student.id} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t-md" 
              style={{ height: `${student.performance}%` }}
            ></div>
            <p className="text-xs mt-2 truncate w-full text-center">{student.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceChart;