import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const EmployeeAvatar = ({ 
  employee, 
  size = "md", 
  showStatus = false,
  className = "" 
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-success";
      case "onLeave": return "bg-warning";
      case "inactive": return "bg-secondary";
      case "terminated": return "bg-error";
      default: return "bg-secondary";
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center text-primary font-semibold shadow-md`}
      >
        {employee?.photo ? (
          <img
            src={employee.photo}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"} font-display font-semibold`}>
            {getInitials(employee?.firstName, employee?.lastName)}
          </span>
        )}
      </motion.div>

      {showStatus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(employee?.status)}`}
        />
      )}
    </div>
  );
};

export default EmployeeAvatar;