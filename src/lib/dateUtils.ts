export const formatDateIN = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const getDaysUntilDue = (dueDate: string) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
};

export const getDeadlineStatus = (dueDate: string, status: string) => {
  if (status === 'completed') return 'completed';
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return 'overdue';
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'warning';
  return 'on_track';
};

export const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};
