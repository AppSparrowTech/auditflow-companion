import { Badge } from '@/components/ui/badge';
import { TaskStatus, TASK_STATUS_LABELS } from '@/types';

const statusStyles: Record<TaskStatus, string> = {
  not_started: 'bg-muted text-muted-foreground border-border',
  started: 'bg-blue-50 text-blue-600 border-blue-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
  waiting_for_customer: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  pending: 'bg-orange-50 text-orange-600 border-orange-200',
  on_hold: 'bg-red-50 text-red-600 border-red-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  filed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${statusStyles[status]}`}>
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}
