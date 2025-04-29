import React from "react";
import { Server, Users, BookOpen, Clock, Activity, AlertCircle } from "lucide-react";

// Properly define the StatusCardProps type
const StatusCard = ({ title, value, description, icon, trend, color }) => {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className={`bg-gradient-to-r ${color} h-2 w-full`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace("from-", "bg-").split(" ")[0].replace("-700", "-100")}`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

const SystemHealthCard = ({ name, status }) => {
  const getStatusColor = () => {
    if (status === "operational") return "bg-green-100 text-green-800";
    if (status === "degraded") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center">
        {status === "operational" && <Server size={18} className="text-green-500 mr-3" />}
        {status === "degraded" && <AlertCircle size={18} className="text-yellow-500 mr-3" />}
        {status === "offline" && <AlertCircle size={18} className="text-red-500 mr-3" />}
        <span className="font-medium text-gray-800 dark:text-white">{name}</span>
      </div>
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

export default function SystemStatus() {
  const systemHealth = [
    { name: "Web Server", status: "operational" },
    { name: "API Server", status: "operational" },
    { name: "Database", status: "operational" },
    { name: "Storage", status: "degraded" },
    { name: "Authentication Service", status: "operational" },
  ];
  
  const recentAlerts = [
    { id: "alert-1", message: "Database backup completed", time: "10 minutes ago", severity: "info" },
    { id: "alert-2", message: "Storage system performance degraded", time: "35 minutes ago", severity: "warning" },
    { id: "alert-3", message: "3 failed login attempts detected", time: "1 hour ago", severity: "error" },
  ];
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Status Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Total Users"
          value="1,285"
          description="Active users in the system"
          icon={<Users size={24} className="text-blue-600" />}
          trend={{ value: 12.5, isPositive: true }}
          color="from-blue-500 to-blue-700"
        />
        <StatusCard
          title="Active Courses"
          value="42"
          description="Currently running courses"
          icon={<BookOpen size={24} className="text-purple-600" />}
          trend={{ value: 5.2, isPositive: true }}
          color="from-purple-500 to-purple-700"
        />
        <StatusCard
          title="System Uptime"
          value="99.98%"
          description="Last 30 days"
          icon={<Clock size={24} className="text-green-600" />}
          color="from-green-500 to-green-700"
        />
        <StatusCard
          title="Server Load"
          value="28%"
          description="Average CPU utilization"
          icon={<Activity size={24} className="text-red-600" />}
          trend={{ value: 3.1, isPositive: false }}
          color="from-red-500 to-red-700"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">System Health</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last updated 2 minutes ago</span>
            </div>
            <div className="space-y-3">
              {systemHealth.map((service, index) => (
                <SystemHealthCard key={index} name={service.name} status={service.status} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Recent Alerts</h3>
            <div className="space-y-4">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="border-l-4 pl-3 py-2"
                  style={{
                    borderColor: alert.severity === "error" ? "#f87171" :
                    alert.severity === "warning" ? "#fbbf24" : "#60a5fa"
                  }}>
                  <p className="text-sm text-gray-800 dark:text-white font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}