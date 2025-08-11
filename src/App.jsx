import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages
import Dashboard from "@/components/pages/Dashboard";
import Employees from "@/components/pages/Employees";
import Schedule from "@/components/pages/Schedule";
import Departments from "@/components/pages/Departments";
import Settings from "@/components/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;