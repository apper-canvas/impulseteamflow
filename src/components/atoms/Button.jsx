import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon
          name="Loader2"
          className={cn("animate-spin", children ? "mr-2" : "", "w-4 h-4")}
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon
          name={icon}
          className={cn("w-4 h-4", children ? "mr-2" : "")}
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon
          name={icon}
          className={cn("w-4 h-4", children ? "ml-2" : "")}
        />
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;