import { useAuth } from '@/contexts/AuthContext';
import { mockClients, mockTasks, mockUsers } from '@/data/mockData';
import { TASK_STATUS_LABELS, TaskStatus, TASK_TYPE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateIN } from '@/lib/dateUtils';
import { Building2, FileText, User } from 'lucide-react';

const statusOrder: TaskStatus[] = ['not_started', 'started', 'in_progress', 'waiting_for_customer', 'pending', 'under_review', 'completed', 'filed'];
const statusColors: Record<TaskStatus, string> = {
  not_started: 'bg-muted',
  started: 'bg-blue-400',
  in_progress: 'bg-blue-500',
  waiting_for_customer: 'bg-yellow-500',
  pending: 'bg-orange-400',
  on_hold: 'bg-red-500',
  under_review: 'bg-amber-500',
  completed: 'bg-green-500',
  filed: 'bg-emerald-500',
};

function StatusProgress({ status }: { status: TaskStatus }) {
  const idx = status === 'on_hold' ? -1 : statusOrder.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {statusOrder.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`h-2.5 w-2.5 rounded-full ${i <= idx ? statusColors[status] : 'bg-muted'}`} />
          {i < statusOrder.length - 1 && <div className={`h-0.5 w-4 ${i < idx ? statusColors[status] : 'bg-muted'}`} />}
        </div>
      ))}
      <span className="text-xs text-muted-foreground ml-2">{TASK_STATUS_LABELS[status]}</span>
    </div>
  );
}

export default function ClientPortal() {
  const { user } = useAuth();
  if (!user) return null;

  const client = mockClients.find(c => c.linked_user_id === user.id);
  if (!client) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">No client file linked to your account.</p>
    </div>
  );

  const tasks = mockTasks.filter(t => t.client_id === client.id);
  const getAssigneeName = (uid: string) => mockUsers.find(u => u.id === uid)?.name ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{client.client_name}</h2>
          <p className="text-sm text-muted-foreground">File: {client.file_number} · {client.client_type}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />Your Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                  <p className="text-xs text-muted-foreground">{TASK_TYPE_LABELS[task.task_type]} · FY {task.financial_year}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <p>Due: {formatDateIN(task.due_date)}</p>
                </div>
              </div>
              <StatusProgress status={task.status} />
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> Handled by: {getAssigneeName(task.assigned_to)}
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>}
        </CardContent>
      </Card>
    </div>
  );
}
