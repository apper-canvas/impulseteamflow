import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const StatusIndicator = ({ status, size = "md" }) => {
  const statusConfig = {
    active: {
      color: "success",
      icon: "CheckCircle",
      label: "Active",
      dotColor: "bg-success"
    },
    inactive: {
      color: "secondary",
      icon: "Clock",
      label: "Inactive", 
      dotColor: "bg-secondary"
    },
    onLeave: {
      color: "warning",
      icon: "Calendar",
      label: "On Leave",
      dotColor: "bg-warning"
    },
    terminated: {
      color: "error",
      icon: "XCircle",
      label: "Terminated",
      dotColor: "bg-error"
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  if (size === "dot") {
    return (
      <div className="flex items-center space-x-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-2 h-2 rounded-full ${config.dotColor}`}
        />
        <span className="text-sm text-gray-600 capitalize">{config.label}</span>
      </div>
    );
  }

  return (
    <Badge variant={config.color} size={size} className="inline-flex items-center space-x-1">
      <ApperIcon name={config.icon} className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusIndicator;