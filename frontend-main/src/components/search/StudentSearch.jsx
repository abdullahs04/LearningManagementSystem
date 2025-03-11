// src/components/search/StudentSearch.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FilterOptions from './FilterOptions';

function StudentSearch({ students, setSelectedStudent }) {
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [filters, setFilters] = useState({
    query: "",
    department: "",
    minAttendance: 0,
    enrollmentDate: ""
  });

  useEffect(() => {
    let result = [...students];
    
    // Filter by search query
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(searchTerm) ||
          student.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by department
    if (filters.department) {
      result = result.filter(student => student.department === filters.department);
    }
    
    // Filter by minimum attendance
    if (filters.minAttendance > 0) {
      result = result.filter(student => student.attendance >= filters.minAttendance);
    }
    
    // Filter by enrollment date
    if (filters.enrollmentDate) {
      result = result.filter(student => student.enrollmentDate === filters.enrollmentDate);
    }
    
    setFilteredStudents(result);
  }, [filters, students]);

  const handleSearch = (e) => {
    setFilters({
      ...filters,
      query: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Search</h1>
        <div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Add New Student
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <FilterOptions filters={filters} setFilters={setFilters} />
        </div>
        
        <div className="md:w-3/4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={filters.query}
                onChange={handleSearch}
                className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={student.imageUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.enrollmentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/student/${student.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            View
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900 mr-3">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No students found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSearch;