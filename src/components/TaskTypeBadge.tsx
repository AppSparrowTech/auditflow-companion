import { Badge } from '@/components/ui/badge';
import { TaskType, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '@/types';

export function TaskTypeBadge({ type }: { type: TaskType }) {
  const colors = TASK_TYPE_COLORS[type];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
      {TASK_TYPE_LABELS[type]}
    </Badge>
  );
}
