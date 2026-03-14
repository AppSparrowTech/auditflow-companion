import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockTasks, mockClients, mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { getDaysUntilDue } from '@/lib/dateUtils';
import { TASK_TYPE_LABELS } from '@/types';
import { Users, Building2, ListTodo, AlertTriangle, Clock, CheckCircle2, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = useMemo(() => {
    const activeTasks = mockTasks.filter(t => t.status !== 'completed');
    const overdue = activeTasks.filter(t => getDaysUntilDue(t.due_date) < 0);
    const completedThisMonth = mockTasks.filter(t => t.status === 'completed');
    const upcomingWeek = activeTasks.filter(t => {
      const d = getDaysUntilDue(t.due_date);
      return d >= 0 && d <= 7;
    });
    return { activeTasks, overdue, completedThisMonth, upcomingWeek };
  }, []);

  const employees = mockUsers.filter(u => u.role === 'employee');
  const employeeWorkload = employees.map(emp => ({
    ...emp,
    taskCount: mockTasks.filter(t => t.assigned_to === emp.id && t.status !== 'completed').length,
    total: mockTasks.filter(t => t.assigned_to === emp.id).length,
  }));

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';
  const getAssigneeName = (id: string) => mockUsers.find(u => u.id === id)?.name ?? '';

  const summaryCards = [
    { label: 'Total Clients', value: mockClients.length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Tasks', value: stats.activeTasks.length, icon: ListTodo, color: 'text-primary bg-accent' },
    { label: 'Overdue', value: stats.overdue.length, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Completed', value: stats.completedThisMonth.length, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Overview of your firm's task health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overdue Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.overdue.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No overdue tasks 🎉</p>
            ) : (
              <div className="space-y-3">
                {stats.overdue.sort((a, b) => getDaysUntilDue(a.due_date) - getDaysUntilDue(b.due_date)).map(task => (
                  <Link key={task.id} to={`/admin/tasks/${task.id}`} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{getClientName(task.client_id)} · {getAssigneeName(task.assigned_to)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <PriorityBadge priority={task.priority} />
                      <DeadlineIndicator dueDate={task.due_date} status={task.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Workload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Employee Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeWorkload.map(emp => (
                <Link key={emp.id} to={`/admin/employees/${emp.id}`} className="block hover:bg-muted/50 p-2 rounded-lg transition-colors -mx-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">{emp.taskCount} active</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min((emp.taskCount / 5) * 100, 100)}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming This Week */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            Upcoming This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.upcomingWeek.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No tasks due this week</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Task</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Assigned To</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.upcomingWeek.map(task => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5">
                        <Link to={`/admin/tasks/${task.id}`} className="font-medium text-foreground hover:text-primary">{task.title}</Link>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{getClientName(task.client_id)}</td>
                      <td className="py-2.5 text-muted-foreground">{TASK_TYPE_LABELS[task.task_type]}</td>
                      <td className="py-2.5 text-muted-foreground">{getAssigneeName(task.assigned_to)}</td>
                      <td className="py-2.5"><TaskStatusBadge status={task.status} /></td>
                      <td className="py-2.5"><DeadlineIndicator dueDate={task.due_date} status={task.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
