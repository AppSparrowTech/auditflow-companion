import { Badge } from '@/components/ui/badge';
import { TaskStatus, TASK_STATUS_LABELS } from '@/types';

const statusStyles: Record<TaskStatus, string> = {
  not_started: 'bg-muted text-muted-foreground border-border',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  on_hold: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${statusStyles[status]}`}>
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}
