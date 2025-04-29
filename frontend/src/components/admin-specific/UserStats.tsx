import { Users, UserPlus, UserCheck, UserX } from "lucide-react";


// TODO fix the view all users
// Statistic card component for displaying user metrics
type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  color: string;
};

function StatCard({ title, value, icon, description, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 dark:bg-${color}-900 dark:text-${color}-400`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

// User type distribution chart component
function UserDistributionChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">User Distribution</h3>
      <div className="flex items-center justify-between mt-4">
        <div className="space-y-2 w-full">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Students</span>
            <span className="font-medium text-gray-800 dark:text-white">65%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          
          <div className="flex justify-between text-sm mt-3">
            <span className="text-gray-600 dark:text-gray-300">Instructors</span>
            <span className="font-medium text-gray-800 dark:text-white">25%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
          
          <div className="flex justify-between text-sm mt-3">
            <span className="text-gray-600 dark:text-gray-300">Administrators</span>
            <span className="font-medium text-gray-800 dark:text-white">10%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent users component
function RecentUsers() {
  const recentUsers = [
    { id: 1, name: "Alex Johnson", email: "alex.j@example.com", role: "Student", date: "2 days ago" },
    { id: 2, name: "Sarah Parker", email: "sarah.p@example.com", role: "Instructor", date: "3 days ago" },
    { id: 3, name: "Mike Wilson", email: "mike.w@example.com", role: "Student", date: "4 days ago" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Users</h3>
      <div className="space-y-4">
        {recentUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 text-xs font-medium rounded-full 
                             bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {user.role}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.date}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-2 text-sm text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
        View All Users
      </button>
    </div>
  );
}

export default function UserStats() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Statistics</h2>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Users"
          value="1,458"
          icon={<Users size={24} />}
          description="12% increase from last month"
          color="blue"
        />
        <StatCard 
          title="New Users"
          value="128"
          icon={<UserPlus size={24} />}
          description="24 new users in the last week"
          color="green"
        />
        <StatCard 
          title="Active Users"
          value="1,089"
          icon={<UserCheck size={24} />}
          description="74.7% of total user base"
          color="purple"
        />
        <StatCard 
          title="Inactive Users"
          value="369"
          icon={<UserX size={24} />}
          description="25.3% of total user base"
          color="amber"
        />
      </div>
      
      {/* Charts and additional info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserDistributionChart />
        <div className="lg:col-span-2">
          <RecentUsers />
        </div>
      </div>
    </div>
  );
}