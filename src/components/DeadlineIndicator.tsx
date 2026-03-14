import { getDaysUntilDue } from '@/lib/dateUtils';
import { formatDateIN } from '@/lib/dateUtils';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function DeadlineIndicator({ dueDate, status }: { dueDate: string; status: string }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {formatDateIN(dueDate)}
      </span>
    );
  }
  const days = getDaysUntilDue(dueDate);
  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold">
        <AlertTriangle className="h-3.5 w-3.5" />
        {Math.abs(days)}d overdue
      </span>
    );
  }
  if (days <= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-600 font-medium">
        <Clock className="h-3.5 w-3.5" />
        {days === 0 ? 'Due today' : `${days}d left`}
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
        <Clock className="h-3.5 w-3.5" />
        {days}d left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="h-3.5 w-3.5" />
      {formatDateIN(dueDate)}
    </span>
  );
}
