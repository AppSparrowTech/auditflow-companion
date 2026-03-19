import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockTasks, mockClients } from '@/data/mockData';
import { TASK_TYPE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { getDaysUntilDue } from '@/lib/dateUtils';
import { ListTodo, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const myTasks = mockTasks.filter(t => t.assigned_to === user.id);
  const active = myTasks.filter(t => t.status !== 'completed' && t.status !== 'filed');
  const overdue = active.filter(t => getDaysUntilDue(t.due_date) < 0);
  const completed = myTasks.filter(t => t.status === 'completed' || t.status === 'filed');

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';

  const cards = [
    { label: 'My Tasks', value: myTasks.length, icon: ListTodo, color: 'text-primary bg-accent' },
    { label: 'Active', value: active.length, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome, {user.name}</h2>
        <p className="text-muted-foreground text-sm">Your task overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{c.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">My Tasks</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map(task => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2.5"><Link to={`/employee/tasks/${task.id}`} className="font-medium hover:text-primary">{task.title}</Link></td>
                    <td className="py-2.5 text-muted-foreground">{getClientName(task.client_id)}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{TASK_TYPE_LABELS[task.task_type]}</td>
                    <td className="py-2.5"><TaskStatusBadge status={task.status} /></td>
                    <td className="py-2.5"><PriorityBadge priority={task.priority} /></td>
                    <td className="py-2.5"><DeadlineIndicator dueDate={task.due_date} status={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
