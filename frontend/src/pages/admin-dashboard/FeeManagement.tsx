import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";

// todo complete this

export default function FeeManagement() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Fee management data
  const feeStatistics = {
    totalCollected: "₹4,567,850",
    pendingDues: "₹789,450",
    currentQuarter: "2023-Q4",
    activePaymentPlans: 342,
    defaulters: 38,
    scholarshipStudents: 76,
    revenueGrowth: "+12.3%",
    averageCollection: "₹9,450"
  };

  const feeCategories = [
    {
      id: 1,
      name: "Student Fee Collection",
      icon: "💰",
      status: "active",
      lastUpdated: "2023-11-15",
      items: [
        { name: "Tuition Fee", value: "₹3,245,700 collected", type: "info" },
        { name: "Library Fee", value: "₹234,500 collected", type: "info" },
        { name: "Lab Fee", value: "₹567,800 collected", type: "info" },
        { name: "Hostel Fee", value: "₹890,450 collected", type: "info" },
        { name: "Due Reminders", value: "42 pending", type: "action" },
        { name: "New Fee Receipt", value: "Generate", type: "button" }
      ]
    },
    {
      id: 2,
      name: "Teacher Payments",
      icon: "👨‍🏫",
      status: "pending",
      lastUpdated: "2023-11-10",
      items: [
        { name: "Monthly Salaries", value: "₹2,345,600 pending", type: "info" },
        { name: "Extra Classes", value: "₹156,700 pending", type: "info" },
        { name: "Overtime Pay", value: "₹87,900 pending", type: "info" },
        { name: "Pending Approvals", value: "14 payments", type: "action" },
        { name: "Process Payments", value: "Initiate", type: "button" }
      ]
    },
    {
      id: 3,
      name: "Fee Structure Management",
      icon: "📋",
      status: "active",
      lastUpdated: "2023-10-30",
      items: [
        { name: "Current Structure", value: "2023-2024 Academic Year", type: "info" },
        { name: "Course-wise Fees", value: "24 courses configured", type: "complex" },
        { name: "Special Categories", value: "5 categories defined", type: "complex" },
        { name: "Fee Revisions", value: "Last updated: Oct 15, 2023", type: "info" },
        { name: "Update Structure", value: "Modify", type: "button" }
      ]
    },
    {
      id: 4,
      name: "Scholarships & Waivers",
      icon: "🎓",
      status: "active",
      lastUpdated: "2023-11-05",
      items: [
        { name: "Merit Scholarships", value: "42 students", type: "info" },
        { name: "Financial Aid", value: "35 students", type: "info" },
        { name: "Sports Scholarships", value: "18 students", type: "info" },
        { name: "Special Waivers", value: "12 students", type: "info" },
        { name: "Pending Applications", value: "8 applications", type: "action" }
      ]
    },
    {
      id: 5,
      name: "Payment Processing",
      icon: "💳",
      status: "issue",
      lastUpdated: "2023-11-12",
      items: [
        { name: "Online Payments", value: "₹2,345,600 (78%)", type: "info" },
        { name: "Bank Transfers", value: "₹456,700 (15%)", type: "info" },
        { name: "Cash Payments", value: "₹234,500 (7%)", type: "info" },
        { name: "Failed Transactions", value: "23 transactions", type: "action" },
        { name: "Reconcile Payments", value: "Process", type: "button" }
      ]
    },
    {
      id: 6,
      name: "Financial Reports",
      icon: "📊",
      status: "active",
      lastUpdated: "2023-11-14",
      items: [
        { name: "Monthly Collection", value: "₹1,245,600 (November)", type: "info" },
        { name: "Quarterly Analysis", value: "Q4 2023", type: "complex" },
        { name: "Department-wise", value: "View breakdown", type: "complex" },
        { name: "Annual Projections", value: "View forecast", type: "complex" },
        { name: "Generate Reports", value: "Export", type: "button" }
      ]
    }
  ];

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    openModal();
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>;
    } else if (status === "pending") {
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>;
    } else {
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">Issue</span>;
    }
  };

  // Render the category details in modal
  const renderCategoryDetails = () => {
    if (!selectedCategory) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedCategory.icon} {selectedCategory.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {selectedCategory.lastUpdated}
            </p>
            <div className="mt-2">
              {getStatusBadge(selectedCategory.status)}
            </div>
          </div>
        </div>

        <div className="mx-auto h-px w-full bg-gray-200 dark:bg-gray-700"></div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Item</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Details</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900/[0.025]">
              {selectedCategory.items.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.value}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    {item.type === "button" || item.type === "action" ? (
                      <button className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                        {item.type === "button" ? item.value : "View"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCategory.status === "issue" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
            <h4 className="text-base font-medium text-red-800 dark:text-red-400">Attention Required</h4>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              There are issues that require your attention. Please review and take appropriate action.
            </p>
          </div>
        )}
        
        {selectedCategory.status === "pending" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
            <h4 className="text-base font-medium text-yellow-800 dark:text-yellow-400">Pending Actions</h4>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              There are pending items that need to be processed. Please review and complete these actions.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Fee Management"
        description="Manage student fees, teacher payments, and financial operations"
      />
      
      {/* Header Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage student fees, process teacher payments, and oversee financial operations
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Period</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{feeStatistics.currentQuarter}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Overview */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Fee Overview</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Key financial metrics and collection status
          </p>
          
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {feeStatistics.totalCollected}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">{feeStatistics.revenueGrowth}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Pending Dues</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {feeStatistics.pendingDues}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{feeStatistics.defaulters} defaulters</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Payment Plans</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {feeStatistics.activePaymentPlans}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">active plans</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Scholarships</h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {feeStatistics.scholarshipStudents}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Management Categories */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Fee Management Categories</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage various aspects of financial operations
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
              {feeCategories.map((category) => (
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
                      Manage
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
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Common fee management tasks</p>
        
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-blue-100 p-3 text-xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">📝</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">New Fee Receipt</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-green-100 p-3 text-xl text-green-600 dark:bg-green-900/30 dark:text-green-400">💸</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Process Payments</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-purple-100 p-3 text-xl text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">📊</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Generate Reports</span>
          </button>
          
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
            <div className="rounded-full bg-orange-100 p-3 text-xl text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">📧</div>
            <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Send Reminders</span>
          </button>
        </div>
      </div>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {renderCategoryDetails()}
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