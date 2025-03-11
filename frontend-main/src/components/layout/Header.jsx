// src/components/layout/Header.jsx
import React from 'react';

function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management System</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-indigo-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>Admin</span>
            <div className="w-8 h-8 bg-indigo-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;