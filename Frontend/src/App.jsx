import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Layout & Guard
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/guards/ProtectedRoute";

// Pages - Public
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Pages - Authenticated
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/Tasks";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;