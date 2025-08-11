import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import scheduleService from "@/services/api/scheduleService";

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, scheduleData] = await Promise.all([
        employeeService.getAll(),
        scheduleService.getAll()
      ]);
      
      setEmployees(employeeData);
      setSchedules(scheduleData);
    } catch (err) {
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getScheduleForEmployeeAndDate = (employeeId, date) => {
    return schedules.find(schedule => 
      schedule.employeeId === employeeId && 
      isSameDay(parseISO(schedule.date), date)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled": return "primary";
      case "present": return "success";
      case "absent": return "error";
      case "late": return "warning";
      default: return "secondary";
    }
  };

  const previousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const nextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const todayDate = () => {
    setCurrentWeek(new Date());
  };

  const headerActions = [
    {
      label: "Today",
      icon: "Calendar",
      variant: "secondary",
      onClick: todayDate
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Layout 
      title="Schedule" 
      subtitle="Weekly team schedule and attendance tracking"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              icon="ChevronLeft"
              onClick={previousWeek}
            />
            <div className="text-center">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
              </h2>
              <p className="text-sm text-gray-600">Week Schedule</p>
            </div>
            <Button
              variant="outline"
              icon="ChevronRight"
              onClick={nextWeek}
            />
          </div>
        </div>

        {/* Schedule Grid */}
        {employees.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No employees to schedule"
            description="Add employees to your team to start managing schedules."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
              <div className="grid grid-cols-8 gap-4">
                <div className="font-medium text-gray-900">Employee</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium text-gray-900">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(day, "MMM d")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Rows */}
            <div className="divide-y divide-gray-200">
              {employees.map((employee, empIndex) => (
                <motion.div
                  key={employee.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: empIndex * 0.05 }}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="grid grid-cols-8 gap-4 items-center">
                    {/* Employee Info */}
                    <div className="flex items-center space-x-3">
                      <EmployeeAvatar 
                        employee={employee} 
                        size="sm" 
                        showStatus={true} 
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </div>
                    </div>

                    {/* Schedule Days */}
                    {weekDays.map((day, dayIndex) => {
                      const schedule = getScheduleForEmployeeAndDate(employee.Id, day);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <div 
                          key={dayIndex} 
                          className={`text-center ${isToday ? "bg-primary/5 rounded-lg p-2" : ""}`}
                        >
                          {schedule ? (
                            <div className="space-y-1">
                              <Badge 
                                variant={getStatusColor(schedule.status)} 
                                size="sm"
                              >
                                {schedule.status}
                              </Badge>
                              <div className="text-xs text-gray-600">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              <ApperIcon name="Minus" className="w-4 h-4 mx-auto" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="Users" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === "scheduled").length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === "present").length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === "late").length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-error/10 rounded-lg">
                <ApperIcon name="XCircle" className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === "absent").length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;