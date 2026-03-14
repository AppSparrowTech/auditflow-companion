import { Link } from 'react-router-dom';
import { mockUsers, mockTasks } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone } from 'lucide-react';

export default function EmployeeManagement() {
  const employees = mockUsers.filter(u => u.role === 'employee');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Employees</h2>
        <p className="text-muted-foreground text-sm">{employees.length} team members</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map(emp => {
          const tasks = mockTasks.filter(t => t.assigned_to === emp.id);
          const active = tasks.filter(t => t.status !== 'completed').length;
          const completed = tasks.filter(t => t.status === 'completed').length;
          return (
            <Link key={emp.id} to={`/admin/employees/${emp.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">{emp.name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="text-sm">{emp.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
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
