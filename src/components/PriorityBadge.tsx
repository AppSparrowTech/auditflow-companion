import { Badge } from '@/components/ui/badge';
import { TaskPriority, TASK_PRIORITY_LABELS } from '@/types';

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-50 text-blue-700',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${priorityStyles[priority]}`}>
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  );
}
