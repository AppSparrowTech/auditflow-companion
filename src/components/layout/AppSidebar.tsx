import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ListTodo, UserCircle, LogOut, FileText
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Clients', url: '/admin/clients', icon: Building2 },
  { title: 'Tasks', url: '/admin/tasks', icon: ListTodo },
  { title: 'Employees', url: '/admin/employees', icon: Users },
];

const employeeItems = [
  { title: 'My Dashboard', url: '/employee', icon: LayoutDashboard },
];

const clientItems = [
  { title: 'My Files', url: '/portal', icon: FileText },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  if (!user) return null;

  const items = user.role === 'admin' ? adminItems : user.role === 'employee' ? employeeItems : clientItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-3 py-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
                  <FileText className="h-4 w-4 text-sidebar-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm text-sidebar-primary">AuditFlow</div>
                  <div className="text-[10px] text-sidebar-foreground/50 font-normal normal-case tracking-normal">Task Tracker</div>
                </div>
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin' || item.url === '/employee' || item.url === '/portal'}
                      className="hover:bg-sidebar-accent/50 text-sidebar-foreground/80 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <UserCircle className="h-5 w-5 text-sidebar-foreground/60" />
            <div className="truncate">
              <div className="text-xs font-medium text-sidebar-foreground">{user.name}</div>
              <div className="text-[10px] text-sidebar-foreground/50 capitalize">{user.role}</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-primary hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
