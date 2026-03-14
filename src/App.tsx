import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ClientManagement from "@/pages/ClientManagement";
import ClientDetail from "@/pages/ClientDetail";
import TaskManagement from "@/pages/TaskManagement";
import TaskDetail from "@/pages/TaskDetail";
import EmployeeManagement from "@/pages/EmployeeManagement";
import EmployeeDetail from "@/pages/EmployeeDetail";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import ClientPortal from "@/pages/ClientPortal";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'employee') return <Navigate to="/employee" replace />;
  return <Navigate to="/portal" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthRedirect />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={['admin']}><ClientManagement /></ProtectedRoute>} />
            <Route path="/admin/clients/:id" element={<ProtectedRoute allowedRoles={['admin']}><ClientDetail /></ProtectedRoute>} />
            <Route path="/admin/tasks" element={<ProtectedRoute allowedRoles={['admin']}><TaskManagement /></ProtectedRoute>} />
            <Route path="/admin/tasks/:id" element={<ProtectedRoute allowedRoles={['admin']}><TaskDetail /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeManagement /></ProtectedRoute>} />
            <Route path="/admin/employees/:id" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeDetail /></ProtectedRoute>} />

            {/* Employee routes */}
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/tasks/:id" element={<ProtectedRoute allowedRoles={['employee']}><TaskDetail /></ProtectedRoute>} />

            {/* Client routes */}
            <Route path="/portal" element={<ProtectedRoute allowedRoles={['client']}><ClientPortal /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
