// src/components/search/FilterOptions.jsx
import React from 'react';

function FilterOptions({ filters, setFilters }) {
  const departments = [
    "All Departments",
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Psychology"
  ];

  const handleAttendanceChange = (e) => {
    setFilters({
      ...filters,
      minAttendance: e.target.value
    });
  };

  const handleDepartmentChange = (e) => {
    setFilters({
      ...filters,
      department: e.target.value === "All Departments" ? "" : e.target.value
    });
  };

  const handleDateChange = (e) => {
    setFilters({
      ...filters,
      enrollmentDate: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      department: "",
      minAttendance: 0,
      enrollmentDate: ""
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={filters.department === "" ? "All Departments" : filters.department}
            onChange={handleDepartmentChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Attendance
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minAttendance}
              onChange={handleAttendanceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none"
            />
            <span className="text-sm font-medium text-gray-700">
              {filters.minAttendance}%
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enrollment Date
          </label>
          <input
            type="date"
            value={filters.enrollmentDate}
            onChange={handleDateChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterOptions;