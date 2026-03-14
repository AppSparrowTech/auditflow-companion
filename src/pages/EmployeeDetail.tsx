import { useParams, Link } from 'react-router-dom';
import { mockUsers, mockTasks, mockClients } from '@/data/mockData';
import { TASK_TYPE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams();
  const employee = mockUsers.find(u => u.id === id);
  if (!employee) return <p className="text-muted-foreground p-8">Employee not found.</p>;

  const tasks = mockTasks.filter(t => t.assigned_to === employee.id);
  const getClientName = (cid: string) => mockClients.find(c => c.id === cid)?.client_name ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/employees"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: tasks.filter(t => t.status !== 'completed').length },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
          { label: 'Total', value: tasks.length },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Assigned Tasks</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2.5"><Link to={`/admin/tasks/${task.id}`} className="font-medium hover:text-primary">{task.title}</Link></td>
                    <td className="py-2.5 text-muted-foreground">{getClientName(task.client_id)}</td>
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
