import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Users", 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 mb-6">
        <ApperIcon
          name={icon}
          className="w-20 h-20 text-secondary"
        />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ 
            scale: 1.05,
            background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;