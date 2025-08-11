import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import StatsCard from "@/components/molecules/StatsCard";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeeData);
      setDepartments(departmentData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === "active").length,
    onLeave: employees.filter(emp => emp.status === "onLeave").length,
    newHires: employees.filter(emp => {
      const startDate = new Date(emp.startDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return startDate >= thirtyDaysAgo;
    }).length
  };

  // Get recent hires
  const recentHires = employees
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 6);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <Layout 
      title="Dashboard" 
      subtitle="Overview of your team and organization"
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon="Users"
            gradient="from-primary/10 to-primary/20"
            iconColor="text-primary"
          />
          
          <StatsCard
            title="Active Today"
            value={stats.activeEmployees}
            icon="UserCheck"
            gradient="from-success/10 to-success/20"
            iconColor="text-success"
            change="+2 from yesterday"
            changeType="positive"
          />
          
          <StatsCard
            title="On Leave"
            value={stats.onLeave}
            icon="Calendar"
            gradient="from-warning/10 to-warning/20"
            iconColor="text-warning"
          />
          
          <StatsCard
            title="New Hires (30d)"
            value={stats.newHires}
            icon="UserPlus"
            gradient="from-info/10 to-info/20"
            iconColor="text-info"
            change="+5 this month"
            changeType="positive"
          />
        </div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Department Overview
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Employee distribution across departments
              </p>
            </div>
            <ApperIcon name="Building2" className="w-6 h-6 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{departments.map((dept, index) => (
              <motion.div
                key={dept?.id ? String(dept.id) : `dept-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">
                      {employees.filter(emp => emp.department === dept.name).length} employees
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {employees.filter(emp => emp.department === dept.name).length}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Hires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Recent Hires
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Latest additions to your team
              </p>
            </div>
            <ApperIcon name="UserPlus" className="w-6 h-6 text-primary" />
          </div>

          {recentHires.length === 0 ? (
            <Empty
              icon="UserPlus"
              title="No recent hires"
              description="No new employees have been added recently."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{recentHires.map((employee, index) => (
                <motion.div
                  key={employee?.Id ? String(employee.Id) : `employee-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EmployeeCard employee={employee} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;