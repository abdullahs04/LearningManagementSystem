// src/components/student/StudentResults.jsx
import React from 'react';

function StudentResults({ subjects }) {
  // Calculate total credits
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  
  // Calculate average grade (simplified)
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  
  let totalWeightedPoints = 0;
  
  subjects.forEach(subject => {
    totalWeightedPoints += subject.credits * (gradePoints[subject.grade] || 0);
  });
  
  const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Academic Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Credits</p>
          <p className="text-2xl font-bold">{totalCredits}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Courses Completed</p>
          <p className="text-2xl font-bold">{subjects.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">GPA</p>
          <p className="text-2xl font-bold">{gpa}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Grade Distribution</h4>
        <div className="flex h-4 rounded-full overflow-hidden">
          {['A', 'B', 'C', 'D', 'F'].map(gradeLetter => {
            const count = subjects.filter(s => s.grade.startsWith(gradeLetter)).length;
            const percentage = (count / subjects.length) * 100;
            
            let bgColor;
            switch(gradeLetter) {
              case 'A': bgColor = 'bg-green-500'; break;
              case 'B': bgColor = 'bg-blue-500'; break;
              case 'C': bgColor = 'bg-yellow-500'; break;
              case 'D': bgColor = 'bg-orange-500'; break;
              case 'F': bgColor = 'bg-red-500'; break;
              default: bgColor = 'bg-gray-500';
            }
            
            return percentage > 0 ? (
              <div 
                key={gradeLetter}
                className={bgColor}
                style={{ width: `${percentage}%` }}
                title={`${gradeLetter}: ${count} courses (${percentage.toFixed(1)}%)`}
              ></div>
            ) : null;
          })}
        </div>
        <div className="flex text-xs mt-1 text-gray-500 justify-between">
          <div>A</div>
          <div>B</div>
          <div>C</div>
          <div>D</div>
          <div>F</div>
        </div>
      </div>
    </div>
  );
}

export default StudentResults;