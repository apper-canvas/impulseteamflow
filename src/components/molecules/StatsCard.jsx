import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "positive",
  gradient = "from-primary/10 to-primary/20",
  iconColor = "text-primary"
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-secondary"
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="card card-hover p-6 bg-gradient-to-br from-white to-gray-50/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-gray-900 mb-2">
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                className={`w-4 h-4 ${changeColors[changeType]}`} 
              />
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <ApperIcon name={icon} className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;