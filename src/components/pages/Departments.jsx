import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import ApperIcon from "@/components/ApperIcon";
import departmentService from "@/services/api/departmentService";
import employeeService from "@/services/api/employeeService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentData, employeeData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentData);
      setEmployees(employeeData);
    } catch (err) {
      setError("Failed to load department data");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentEmployees = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName);
  };

  const getDepartmentManager = (managerId) => {
    return employees.find(emp => emp.Id === managerId);
  };

  const getDepartmentStats = (departmentName) => {
    const deptEmployees = getDepartmentEmployees(departmentName);
    return {
      total: deptEmployees.length,
      active: deptEmployees.filter(emp => emp.status === "active").length,
      onLeave: deptEmployees.filter(emp => emp.status === "onLeave").length
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Layout 
      title="Departments" 
      subtitle="Manage your organization's departments and teams"
    >
      <div className="space-y-6">
        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ApperIcon name="Building2" className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-3xl font-display font-bold text-gray-900">
                  {departments.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-xl">
                <ApperIcon name="Users" className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-display font-bold text-gray-900">
                  {employees.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-info/10 rounded-xl">
                <ApperIcon name="TrendingUp" className="w-8 h-8 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Dept</p>
                <p className="text-3xl font-display font-bold text-gray-900">
                  {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning/10 rounded-xl">
                <ApperIcon name="UserCheck" className="w-8 h-8 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-3xl font-display font-bold text-gray-900">
                  {departments.filter(dept => dept.managerId).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Department Cards */}
        {departments.length === 0 ? (
          <Empty
            icon="Building2"
            title="No departments found"
            description="Create departments to organize your team structure."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.map((department, index) => {
              const deptEmployees = getDepartmentEmployees(department.name);
              const manager = getDepartmentManager(department.managerId);
              const stats = getDepartmentStats(department.name);

              return (
                <motion.div
                  key={department.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="card p-6 bg-gradient-to-br from-white to-gray-50/30"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                        {department.name}
                      </h3>
                      {manager && (
                        <div className="flex items-center space-x-2">
                          <EmployeeAvatar employee={manager} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {manager.firstName} {manager.lastName}
                            </p>
                            <p className="text-xs text-gray-500">Department Manager</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
                      <ApperIcon name="Building2" className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{stats.active}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{stats.onLeave}</p>
                      <p className="text-xs text-gray-500">On Leave</p>
                    </div>
                  </div>

                  {/* Employee Avatars */}
                  {deptEmployees.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Team Members</p>
                        <Badge variant="secondary" size="sm">
                          {deptEmployees.length}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {deptEmployees.slice(0, 8).map((employee) => (
                          <div
                            key={employee.Id}
                            className="flex items-center space-x-1"
                            title={`${employee.firstName} ${employee.lastName}`}
                          >
                            <EmployeeAvatar 
                              employee={employee} 
                              size="sm" 
                              showStatus={true}
                            />
                          </div>
                        ))}
                        
                        {deptEmployees.length > 8 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              +{deptEmployees.length - 8}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ApperIcon name="Users" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No employees assigned</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Departments;