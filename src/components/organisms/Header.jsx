import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ 
  title = "TeamFlow", 
  subtitle,
  onMenuToggle,
  showMenuButton = false,
  actions = []
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuToggle}
              className="lg:hidden"
            />
          )}
          
          <div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex items-center space-x-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "primary"}
                size={action.size || "md"}
                icon={action.icon}
                onClick={action.onClick}
                className={action.className}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;