import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTasks, mockClients, mockUsers, mockComments } from '@/data/mockData';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, TaskStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { formatDateIN, formatDateTime } from '@/lib/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import { isStaffRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, User, MessageSquare } from 'lucide-react';

const STATUS_FLOW: TaskStatus[] = ['not_started', 'in_progress', 'under_review', 'completed', 'filed'];

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const task = mockTasks.find(t => t.id === id);
  const [comments, setComments] = useState(mockComments.filter(c => c.task_id === id));
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'not_started');

  if (!task) return <p className="text-muted-foreground p-8">Task not found.</p>;

  const client = mockClients.find(c => c.id === task.client_id);
  const assignee = mockUsers.find(u => u.id === task.assigned_to);
  const backUrl = user?.role === 'admin' || user?.role === 'manager' ? '/admin/tasks' : '/employee';

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    if (user) {
      setComments(prev => [...prev, {
        id: `cm-${Date.now()}`, task_id: task.id, user_id: user.id,
        comment: `Status changed to "${TASK_STATUS_LABELS[newStatus]}"`,
        created_at: new Date().toISOString(),
      }]);
    }
    toast({ title: 'Status updated', description: `Task is now "${TASK_STATUS_LABELS[newStatus]}"` });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    setComments(prev => [...prev, {
      id: `cm-${Date.now()}`, task_id: task.id, user_id: user.id,
      comment: newComment.trim(), created_at: new Date().toISOString(),
    }]);
    setNewComment('');
    toast({ title: 'Comment added' });
  };

  const getUserName = (uid: string) => mockUsers.find(u => u.id === uid)?.name ?? 'Unknown';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to={backUrl}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">{task.title}</h2>
          <p className="text-sm text-muted-foreground">{client?.client_name} · {TASK_TYPE_LABELS[task.task_type]} · FY {task.financial_year}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><TaskStatusBadge status={status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><PriorityBadge priority={task.priority} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span><DeadlineIndicator dueDate={task.due_date} status={status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To</span><span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{assignee?.name}</span></div>
            {task.start_date && <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span>{formatDateIN(task.start_date)}</span></div>}
            {task.assessment_year && <div className="flex justify-between"><span className="text-muted-foreground">Assessment Year</span><span>{task.assessment_year}</span></div>}
            {task.description && <div className="pt-2 border-t"><p className="text-muted-foreground">{task.description}</p></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Update Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {STATUS_FLOW.map(s => (
                <Button key={s} variant={status === s ? 'default' : 'outline'} size="sm" className="w-full justify-start" onClick={() => handleStatusChange(s)} disabled={status === s}>
                  {TASK_STATUS_LABELS[s]}
                </Button>
              ))}
              <Button variant={status === 'on_hold' ? 'default' : 'outline'} size="sm" className="w-full justify-start" onClick={() => handleStatusChange('on_hold')} disabled={status === 'on_hold'}>
                On Hold
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" />Activity ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && isStaffRole(user.role) && (
            <div className="flex gap-2">
              <Textarea placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="min-h-[60px]" />
              <Button onClick={handleAddComment} disabled={!newComment.trim()} className="self-end">Post</Button>
            </div>
          )}
          <div className="space-y-3">
            {comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(c => (
              <div key={c.id} className="border rounded-lg p-3 bg-muted/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{getUserName(c.user_id)}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(c.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.comment}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
