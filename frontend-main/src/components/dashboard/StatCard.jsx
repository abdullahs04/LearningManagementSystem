// src/components/dashboard/StatCard.jsx
import React from 'react';

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('border-', 'bg-')} bg-opacity-20`}>
          {/* Icon would go here */}
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;