import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, activeFilter]);

  const loadData = async () => {
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
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(emp => emp.department === activeFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        setEmployees(prev => prev.filter(emp => emp.Id !== employee.Id));
        toast.success("Employee deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (selectedEmployee) {
        const updated = await employeeService.update(selectedEmployee.Id, employeeData);
        setEmployees(prev => prev.map(emp => emp.Id === selectedEmployee.Id ? updated : emp));
      } else {
        const newEmployee = await employeeService.create(employeeData);
        setEmployees(prev => [...prev, newEmployee]);
      }
      setIsModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Role", "Department", "Status", "Start Date"].join(","),
      ...filteredEmployees.map(emp => [
        `"${emp.firstName} ${emp.lastName}"`,
        emp.email,
        emp.phone,
        emp.role,
        emp.department,
        emp.status,
        emp.startDate
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Employee data exported successfully!");
  };

  const departmentFilters = departments.map(dept => ({
    label: dept.name,
    value: dept.name
  }));

  const headerActions = [
    {
      label: "Export CSV",
      icon: "Download",
      variant: "secondary",
      onClick: handleExport
    },
    {
      label: "Add Employee",
      icon: "Plus",
      variant: "primary",
      onClick: handleAddEmployee
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Layout 
      title="Employees" 
      subtitle={`Manage your team of ${employees.length} employees`}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <SearchBar
          placeholder="Search employees by name, email, role, or department..."
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={departmentFilters}
        />

        {/* Employee Grid */}
        {filteredEmployees.length === 0 ? (
          <Empty
            icon="Users"
            title="No employees found"
            description={searchTerm || activeFilter !== "all" 
              ? "Try adjusting your search criteria or filters."
              : "Get started by adding your first employee to the system."
            }
            actionLabel="Add Employee"
            onAction={handleAddEmployee}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EmployeeCard
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredEmployees.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-500 pt-4"
          >
            Showing {filteredEmployees.length} of {employees.length} employees
            {searchTerm && ` matching "${searchTerm}"`}
            {activeFilter !== "all" && ` in ${activeFilter}`}
          </motion.div>
        )}
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        departments={departments}
        onSave={handleSaveEmployee}
      />
    </Layout>
  );
};

export default Employees;