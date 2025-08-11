import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import StatusIndicator from "@/components/molecules/StatusIndicator";

const EmployeeCard = ({ employee, onEdit, onDelete, onView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="card card-hover p-6 relative bg-gradient-to-br from-white to-gray-50/30"
    >
      {/* Header with Menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <EmployeeAvatar employee={employee} size="lg" showStatus={true} />
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            icon="MoreVertical"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600"
          />
          
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              <button
                onClick={() => {
                  onView?.(employee);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ApperIcon name="Eye" className="w-4 h-4 mr-3" />
                View Details
              </button>
              <button
                onClick={() => {
                  onEdit?.(employee);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-3" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(employee);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-3" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Department Badge */}
      <div className="mb-4">
        <Badge variant="primary" size="sm">
          {employee.department}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="w-4 h-4" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="w-4 h-4" />
          <span>{employee.phone}</span>
        </div>
      </div>

      {/* Status and Start Date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <StatusIndicator status={employee.status} size="sm" />
        <div className="text-xs text-gray-500">
          Started {formatDate(employee.startDate)}
        </div>
      </div>

      {/* Click overlay to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default EmployeeCard;