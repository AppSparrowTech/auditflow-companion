import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, isStaffRole } from "@/contexts/AuthContext";
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
import EngagementManagement from "@/pages/EngagementManagement";
import ComplianceCalendar from "@/pages/ComplianceCalendar";
import BillingManagement from "@/pages/BillingManagement";
import DocumentManagement from "@/pages/DocumentManagement";
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
  if (user.role === 'admin' || user.role === 'manager') return <Navigate to="/admin" replace />;
  if (user.role === 'article' || user.role === 'billing_staff') return <Navigate to="/employee" replace />;
  return <Navigate to="/portal" replace />;
}

const staffRoles = ['admin', 'manager', 'article', 'billing_staff'];
const adminManagerRoles = ['admin', 'manager'];
const clientRoles = ['client_primary', 'client_secondary'];

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

            {/* Admin/Manager routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={adminManagerRoles}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={[...adminManagerRoles, 'billing_staff']}><ClientManagement /></ProtectedRoute>} />
            <Route path="/admin/clients/:id" element={<ProtectedRoute allowedRoles={[...adminManagerRoles, 'billing_staff']}><ClientDetail /></ProtectedRoute>} />
            <Route path="/admin/engagements" element={<ProtectedRoute allowedRoles={adminManagerRoles}><EngagementManagement /></ProtectedRoute>} />
            <Route path="/admin/tasks" element={<ProtectedRoute allowedRoles={adminManagerRoles}><TaskManagement /></ProtectedRoute>} />
            <Route path="/admin/tasks/:id" element={<ProtectedRoute allowedRoles={adminManagerRoles}><TaskDetail /></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={adminManagerRoles}><DocumentManagement /></ProtectedRoute>} />
            <Route path="/admin/compliance" element={<ProtectedRoute allowedRoles={adminManagerRoles}><ComplianceCalendar /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute allowedRoles={[...adminManagerRoles, 'billing_staff']}><BillingManagement /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={adminManagerRoles}><EmployeeManagement /></ProtectedRoute>} />
            <Route path="/admin/employees/:id" element={<ProtectedRoute allowedRoles={adminManagerRoles}><EmployeeDetail /></ProtectedRoute>} />

            {/* Employee/Article routes */}
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['article', 'billing_staff']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/tasks/:id" element={<ProtectedRoute allowedRoles={['article', 'billing_staff']}><TaskDetail /></ProtectedRoute>} />

            {/* Client routes */}
            <Route path="/portal" element={<ProtectedRoute allowedRoles={clientRoles}><ClientPortal /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
