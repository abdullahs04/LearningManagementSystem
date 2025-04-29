import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

export default function StaffManagement() {
  const [staff, setStaff] = useState([
    { id: 1, name: "John Doe", role: "Teacher", contact: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", role: "Admin", contact: "jane.smith@example.com" },
    { id: 3, name: "Alice Johnson", role: "Teacher", contact: "alice.johnson@example.com" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [newStaff, setNewStaff] = useState({ name: "", role: "", contact: "" });

  const handleAddStaff = () => {
    openModal();
  };

  const handleSaveStaff = () => {
    const staffToAdd = { ...newStaff, id: Date.now() };
    setStaff([...staff, staffToAdd]);
    setNewStaff({ name: "", role: "", contact: "" });
    closeModal();
  };

  const handleRemoveStaff = (id) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageMeta
        title="Staff Management"
        description="Manage staff members, add or remove teachers and other staff."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add, remove, and manage staff members such as teachers and administrators.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:p-6">
          <input
            type="text"
            placeholder="Search for staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Staff List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-5 lg:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Staff Members</h2>
              <Button
                onClick={handleAddStaff}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Add Staff
              </Button>
            </div>
          </div>
          <div className="overflow-hidden">
            {filteredStaff.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredStaff.map((member) => (
                  <li key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center justify-between p-5 lg:p-6">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.contact}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleRemoveStaff(member.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5 text-center text-gray-600 dark:text-gray-400">
                No staff members found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Staff Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Add New Staff Member
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill in the details for the new staff member.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Role"
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="email"
              placeholder="Contact"
              value={newStaff.contact}
              onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveStaff}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Staff
            </Button>
            <Button
              onClick={closeModal}
              className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}