import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";

const EmployeeModal = ({ 
  isOpen, 
  onClose, 
  employee = null, 
  departments = [],
  onSave 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    status: "active",
    startDate: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    }
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        address: employee.address || {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        emergencyContact: employee.emergencyContact || {
          name: "",
          relationship: "",
          phone: ""
        }
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        emergencyContact: {
          name: "",
          relationship: "",
          phone: ""
        }
      });
    }
  }, [employee, isOpen]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      toast.success(
        employee ? "Employee updated successfully!" : "Employee added successfully!"
      );
      onClose();
    } catch (error) {
      toast.error("Failed to save employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "User" },
    { id: "contact", label: "Contact", icon: "Phone" },
    { id: "emergency", label: "Emergency", icon: "Shield" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <EmployeeAvatar employee={formData} size="md" />
                <div>
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    {employee ? "Edit Employee" : "Add New Employee"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {employee ? "Update employee information" : "Enter employee details"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      label="Job Role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Department"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </Select>

                      <Select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="onLeave">On Leave</option>
                        <option value="terminated">Terminated</option>
                      </Select>
                    </div>

                    <Input
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </motion.div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      label="Street Address"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange("address.street", e.target.value)}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange("address.city", e.target.value)}
                      />
                      <Input
                        label="State"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange("address.state", e.target.value)}
                      />
                      <Input
                        label="ZIP Code"
                        value={formData.address.zipCode}
                        onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Emergency Contact Tab */}
                {activeTab === "emergency" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Emergency Contact Name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  icon={employee ? "Save" : "Plus"}
                >
                  {employee ? "Update Employee" : "Add Employee"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EmployeeModal;