import { Link } from 'react-router-dom';
import { mockUsers, mockTasks } from '@/data/mockData';
import { USER_ROLE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isStaffRole } from '@/contexts/AuthContext';

export default function EmployeeManagement() {
  const staff = mockUsers.filter(u => isStaffRole(u.role) && u.role !== 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Team Members</h2>
        <p className="text-muted-foreground text-sm">{staff.length} team members</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map(emp => {
          const tasks = mockTasks.filter(t => t.assigned_to === emp.id);
          const active = tasks.filter(t => t.status !== 'completed' && t.status !== 'filed').length;
          const completed = tasks.filter(t => t.status === 'completed' || t.status === 'filed').length;
          return (
            <Link key={emp.id} to={`/admin/employees/${emp.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">{emp.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm">{emp.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{emp.designation ?? emp.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{USER_ROLE_LABELS[emp.role]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-3 text-xs mt-2 pt-2 border-t">
                    <span><span className="font-semibold text-primary">{active}</span> active</span>
                    <span><span className="font-semibold text-green-600">{completed}</span> completed</span>
                    <span>{tasks.length} total</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
