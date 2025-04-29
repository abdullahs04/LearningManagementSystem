import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

// TODO make it complete and fix issues.

export default function SystemSettings() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedSetting, setSelectedSetting] = useState(null);
  
  const systemInfo = {
    version: "v2.3.5",
    lastUpdated: "2023-11-15",
    environment: "Production",
    uptime: "99.98%",
    storageUsed: "45.2GB",
    storageTotal: "100GB",
    databaseSize: "32.1GB",
    activeUsers: 1245,
    registeredUsers: 5672,
    courses: 189,
    departments: 12
  };

  const settingCategories = [
    {
      id: 1,
      name: "General Settings",
      icon: "🔧",
      status: "configured",
      lastUpdated: "2023-11-10",
      settings: [
        { name: "System Name", value: "Learning Management System", type: "text" },
        { name: "Institution Name", value: "University of Technology", type: "text" },
        { name: "Academic Year", value: "2023-2024", type: "text" },
        { name: "Contact Email", value: "admin@university.edu", type: "email" },
        { name: "Support Phone", value: "+1-555-123-4567", type: "text" },
        { name: "Time Zone", value: "UTC-05:00 (Eastern Time)", type: "select" }
      ]
    },
    {
      id: 2,
      name: "Security Settings",
      icon: "🔒",
      status: "attention",
      lastUpdated: "2023-11-02",
      settings: [
        { name: "Password Policy", value: "Strong (8+ chars, special chars required)", type: "select" },
        { name: "Session Timeout", value: "30 minutes", type: "select" },
        { name: "Two-Factor Authentication", value: "Optional", type: "toggle" },
        { name: "IP Restrictions", value: "Disabled", type: "toggle" },
        { name: "Failed Login Attempts", value: "5 attempts (then 15-min lockout)", type: "select" }
      ]
    },
    {
      id: 3,
      name: "Email Notifications",
      icon: "📧",
      status: "configured",
      lastUpdated: "2023-10-25",
      settings: [
        { name: "SMTP Server", value: "smtp.university.edu", type: "text" },
        { name: "SMTP Port", value: "587", type: "number" },
        { name: "Sender Email", value: "no-reply@university.edu", type: "email" },
        { name: "Email Templates", value: "12 active templates", type: "complex" },
        { name: "Email Digest", value: "Enabled (Daily)", type: "select" }
      ]
    },
    {
      id: 4,
      name: "User Permissions",
      icon: "👥",
      status: "configured",
      lastUpdated: "2023-11-12",
      settings: [
        { name: "Admin Roles", value: "3 custom roles configured", type: "complex" },
        { name: "Staff Roles", value: "5 custom roles configured", type: "complex" },
        { name: "Student Permissions", value: "Basic access", type: "select" },
        { name: "Guest Access", value: "Disabled", type: "toggle" }
      ]
    },
    {
      id: 5,
      name: "Backup & Restoration",
      icon: "💾",
      status: "attention",
      lastUpdated: "2023-10-31",
      settings: [
        { name: "Auto Backup Frequency", value: "Daily", type: "select" },
        { name: "Backup Retention", value: "30 days", type: "select" },
        { name: "Last Successful Backup", value: "2023-11-14 03:15 AM", type: "text" },
        { name: "Backup Location", value: "AWS S3 Bucket", type: "select" }
      ]
    },
    {
      id: 6,
      name: "System Maintenance",
      icon: "🛠️",
      status: "warning",
      lastUpdated: "2023-09-18",
      settings: [
        { name: "Maintenance Mode", value: "Disabled", type: "toggle" },
        { name: "Schedule Maintenance", value: "No upcoming maintenance", type: "complex" },
        { name: "Database Optimization", value: "Last run: 45 days ago", type: "button" },
        { name: "Cache Management", value: "Auto-flush: Weekly", type: "select" }
      ]
    }
  ];

  const handleOpenModal = (setting) => {
    setSelectedSetting(setting);
    openModal();
  };

  const getStatusBadge = (status) => {
    if (status === "configured") {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Configured</span>;
    } else if (status === "attention") {
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Needs Attention</span>;
    } else {
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">Warning</span>;
    }
  };

  // Render the setting details in modal
  const renderSettingDetails = () => {
    if (!selectedSetting) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedSetting.icon} {selectedSetting.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {selectedSetting.lastUpdated}
            </p>
            <div className="mt-2">
              {getStatusBadge(selectedSetting.status)}
            </div>
          </div>
        </div>

        <div className="mx-auto h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Setting</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Value</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {selectedSetting.settings.map((setting, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{setting.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{setting.value}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <button className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSetting.status === "warning" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
            <h4 className="text-base font-medium text-red-800 dark:text-red-400">Attention Required</h4>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              This section requires immediate attention. Please update settings to ensure system stability.
            </p>
          </div>
        )}
        
        {selectedSetting.status === "attention" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
            <h4 className="text-base font-medium text-yellow-800 dark:text-yellow-400">Review Recommended</h4>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Some settings in this section may need review to optimize system performance.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="System Settings"
        description="Manage system-wide settings and configurations"
      />
      
      {/* Header Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Configure and manage system-wide settings and preferences
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Version</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemInfo.version}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Overview</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Key metrics and information about your LMS
          </p>
          
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Environment</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {systemInfo.environment}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {systemInfo.uptime}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">last 30 days</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Storage</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {systemInfo.storageUsed} / {systemInfo.storageTotal}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {systemInfo.activeUsers.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">of {systemInfo.registeredUsers.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings Categories</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure various aspects of your learning management system
          </p>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Updated</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {settingCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">{category.icon}</span>
                      <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(category.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {category.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      onClick={() => handleOpenModal(category)}
                      className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Common system management tasks</p>
        
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-blue-100 p-3 text-xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">🔄</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Update System</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-green-100 p-3 text-xl text-green-600 dark:bg-green-900/30 dark:text-green-400">💾</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Backup Now</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-purple-100 p-3 text-xl text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">📊</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">System Report</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-orange-100 p-3 text-xl text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">🧹</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Settings Detail Modal */}
      {selectedSetting && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderSettingDetails()}
          </div>
          <div className="flex justify-end gap-4 border-t border-gray-200 p-4 dark:border-gray-700">
            <Button
              onClick={closeModal}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={closeModal}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}