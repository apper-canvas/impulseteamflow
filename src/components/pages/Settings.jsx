import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    companyName: "TeamFlow Inc.",
    companyEmail: "admin@teamflow.com",
    companyPhone: "+1 (555) 123-4567",
    address: "123 Business St, Suite 100",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/dd/yyyy",
    workingHours: {
      start: "09:00",
      end: "17:00"
    }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    employeeUpdates: true,
    scheduleChanges: true,
    attendanceAlerts: false,
    weeklyReports: true
  });

  const handleCompanySettingChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setCompanySettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCompanySettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Settings saved successfully!");
    setLoading(false);
  };

  const settingSections = [
    {
      id: "company",
      title: "Company Information",
      icon: "Building2",
      description: "Basic company details and contact information"
    },
    {
      id: "preferences",
      title: "System Preferences", 
      icon: "Settings",
      description: "Configure timezone, date format, and working hours"
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: "Bell",
      description: "Manage email alerts and system notifications"
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: "Shield",
      description: "Data export, backup settings, and privacy controls"
    }
  ];

  return (
    <Layout 
      title="Settings" 
      subtitle="Configure your TeamFlow system preferences"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Settings Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settingSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="card p-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ApperIcon name={section.icon} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Company Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Building2" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Company Information
              </h2>
              <p className="text-sm text-gray-600">
                Update your company details and contact information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={companySettings.companyName}
              onChange={(e) => handleCompanySettingChange("companyName", e.target.value)}
            />
            
            <Input
              label="Company Email"
              type="email"
              value={companySettings.companyEmail}
              onChange={(e) => handleCompanySettingChange("companyEmail", e.target.value)}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={companySettings.companyPhone}
              onChange={(e) => handleCompanySettingChange("companyPhone", e.target.value)}
            />
            
            <Input
              label="ZIP Code"
              value={companySettings.zipCode}
              onChange={(e) => handleCompanySettingChange("zipCode", e.target.value)}
            />
            
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                value={companySettings.address}
                onChange={(e) => handleCompanySettingChange("address", e.target.value)}
              />
            </div>
            
            <Input
              label="City"
              value={companySettings.city}
              onChange={(e) => handleCompanySettingChange("city", e.target.value)}
            />
            
            <Input
              label="State"
              value={companySettings.state}
              onChange={(e) => handleCompanySettingChange("state", e.target.value)}
            />
          </div>
        </motion.div>

        {/* System Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-success/10 rounded-lg">
              <ApperIcon name="Settings" className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                System Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Configure timezone, date format, and working hours
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Timezone"
              value={companySettings.timezone}
              onChange={(e) => handleCompanySettingChange("timezone", e.target.value)}
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </Select>
            
            <Select
              label="Date Format"
              value={companySettings.dateFormat}
              onChange={(e) => handleCompanySettingChange("dateFormat", e.target.value)}
            >
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
            </Select>
            
            <Input
              label="Working Hours - Start"
              type="time"
              value={companySettings.workingHours.start}
              onChange={(e) => handleCompanySettingChange("workingHours.start", e.target.value)}
            />
            
            <Input
              label="Working Hours - End"
              type="time"
              value={companySettings.workingHours.end}
              onChange={(e) => handleCompanySettingChange("workingHours.end", e.target.value)}
            />
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-lg">
              <ApperIcon name="Bell" className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Choose which notifications you'd like to receive
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "emailNotifications",
                title: "Email Notifications",
                description: "Receive general system notifications via email"
              },
              {
                key: "employeeUpdates",
                title: "Employee Updates",
                description: "Get notified when employee information is updated"
              },
              {
                key: "scheduleChanges",
                title: "Schedule Changes",
                description: "Receive alerts when schedules are modified"
              },
              {
                key: "attendanceAlerts",
                title: "Attendance Alerts",
                description: "Get notified about attendance issues"
              },
              {
                key: "weeklyReports",
                title: "Weekly Reports",
                description: "Receive weekly summary reports"
              }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{setting.title}</p>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[setting.key]}
                    onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-error/10 rounded-lg">
              <ApperIcon name="Shield" className="w-6 h-6 text-error" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Data & Security
              </h2>
              <p className="text-sm text-gray-600">
                Manage your data export and security preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                icon="Download"
                className="w-full justify-start"
              >
                Export All Employee Data
              </Button>
              
              <Button
                variant="outline"
                icon="Database"
                className="w-full justify-start"
              >
                Backup System Data
              </Button>
            </div>
            
            <div className="space-y-4">
              <Button
                variant="outline"
                icon="FileText"
                className="w-full justify-start"
              >
                View Privacy Policy
              </Button>
              
              <Button
                variant="outline"
                icon="HelpCircle"
                className="w-full justify-start"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSaveSettings}
            loading={loading}
            icon="Save"
            size="lg"
          >
            Save All Settings
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;