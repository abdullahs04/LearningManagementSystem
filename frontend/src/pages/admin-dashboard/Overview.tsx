import PageMeta from "../../components/common/PageMeta";
import UserStats from "../../components/admin-specific/UserStats";
import SystemStatus from "../../components/admin-specific/SystemStatus";
import RecentActivities from "../../components/admin-specific/RecentActivities";
import QuickActions from "../../components/admin-specific/QuickActions";
import AdminNotifications from "../../components/admin-specific/AdminNotifications";
import CoursesOverview from "../../components/admin-specific/CoursesOverview";
import UsersManagement from "../../components/admin-specific/UsersManagement";

export default function AdminOverview() {
  return (
    <>
      <PageMeta
        title="LGS Admin Dashboard"
        description="Admin Dashboard Overview for Learning Management System"
      />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold dark:text-white mb-6">Admin Dashboard</h2>
        
        <div className="mb-8">
          <QuickActions />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <div className="mb-8">
              <UserStats />
            </div>
            
            
            {/* System Status */}
            <div className="mb-8">
              <SystemStatus />
            </div>
            
          </div>
          
          {/* Right Column - Notifications */}
          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Notifications</h3>
              <AdminNotifications />
            </div>
          </div>
        </div>
        
        {/* Users Management */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Users Management</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <UsersManagement />
          </div>
        </div>
        
        {/* Bottom Row - Courses & Activities */}
        <div className="grid grid-cols-12 gap-6">
          {/* Courses Overview */}
          <div className="col-span-12 xl:col-span-8 mb-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Courses Overview</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <CoursesOverview />
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="col-span-12 xl:col-span-4 mb-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Recent Activities</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <RecentActivities />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}