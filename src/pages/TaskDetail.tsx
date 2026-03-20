import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTasks, mockClients, mockUsers, mockComments, mockTimeSessions, mockStatusChanges } from '@/data/mockData';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, TaskStatus, TimeSession, TaskStatusChange } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/TaskTypeBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { Badge } from '@/components/ui/badge';
import { formatDateIN, formatDateTime } from '@/lib/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import { isStaffRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, User, MessageSquare, Clock, Play, Square, History, ArrowRightLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUS_FLOW: TaskStatus[] = ['not_started', 'started', 'in_progress', 'waiting_for_customer', 'pending', 'on_hold', 'under_review', 'completed', 'filed'];

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatDurationFromMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const task = mockTasks.find(t => t.id === id);
  const [comments, setComments] = useState(mockComments.filter(c => c.task_id === id));
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'not_started');
  const [timeSessions, setTimeSessions] = useState<TimeSession[]>(mockTimeSessions.filter(s => s.task_id === id));
  const [statusChanges, setStatusChanges] = useState<TaskStatusChange[]>(mockStatusChanges.filter(s => s.task_id === id));
  const [activeSession, setActiveSession] = useState<TimeSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSession) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - new Date(activeSession.start_time).getTime());
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeSession]);

  if (!task) return <p className="text-muted-foreground p-8">Task not found.</p>;

  const client = mockClients.find(c => c.id === task.client_id);
  const assignee = mockUsers.find(u => u.id === task.assigned_to);
  const backUrl = user?.role === 'admin' || user?.role === 'manager' ? '/admin/tasks' : '/employee';

  const totalMinutes = timeSessions
    .filter(s => s.duration_minutes)
    .reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0);

  const handleStartTimer = () => {
    if (!user) return;
    const session: TimeSession = {
      id: `ts-${Date.now()}`,
      task_id: task.id,
      user_id: user.id,
      start_time: new Date().toISOString(),
    };
    setActiveSession(session);
    setElapsed(0);
    toast({ title: 'Timer started', description: 'Working on this task...' });
  };

  const handleStopTimer = () => {
    if (!activeSession || !user) return;
    const endTime = new Date();
    const durationMs = endTime.getTime() - new Date(activeSession.start_time).getTime();
    const durationMinutes = Math.round(durationMs / 60000);
    const completed: TimeSession = {
      ...activeSession,
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
    };
    setTimeSessions(prev => [...prev, completed]);
    mockTimeSessions.push(completed);
    setActiveSession(null);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    toast({ title: 'Timer stopped', description: `Session logged: ${formatDuration(durationMinutes)}` });
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!user) return;
    const change: TaskStatusChange = {
      id: `sc-${Date.now()}`,
      task_id: task.id,
      user_id: user.id,
      from_status: status,
      to_status: newStatus,
      changed_at: new Date().toISOString(),
    };
    setStatusChanges(prev => [...prev, change]);
    mockStatusChanges.push(change);
    setStatus(newStatus);
    setComments(prev => [...prev, {
      id: `cm-${Date.now()}`, task_id: task.id, user_id: user.id,
      comment: `Status changed from "${TASK_STATUS_LABELS[status]}" to "${TASK_STATUS_LABELS[newStatus]}"`,
      created_at: new Date().toISOString(),
    }]);
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link to={backUrl}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">{task.title}</h2>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-sm text-muted-foreground">{client?.client_name}</span>
            <span className="text-muted-foreground">·</span>
            <TaskTypeBadge type={task.task_type} />
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">FY {task.financial_year}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Details */}
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

        {/* Time Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" />Time Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-mono font-bold text-foreground">
                {activeSession ? formatDurationFromMs(elapsed) : formatDuration(totalMinutes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeSession ? 'Current Session' : 'Total Hours Worked'}
              </p>
            </div>

            {user && isStaffRole(user.role) && (
              <div className="flex gap-2">
                {!activeSession ? (
                  <Button onClick={handleStartTimer} className="w-full gap-2" variant="default">
                    <Play className="h-4 w-4" /> Start Timer
                  </Button>
                ) : (
                  <Button onClick={handleStopTimer} className="w-full gap-2" variant="destructive">
                    <Square className="h-4 w-4" /> Stop Timer
                  </Button>
                )}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              {timeSessions.length} session{timeSessions.length !== 1 ? 's' : ''} logged
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Update Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {STATUS_FLOW.map(s => (
                <Button key={s} variant={status === s ? 'default' : 'outline'} size="sm" className="w-full justify-start text-xs" onClick={() => handleStatusChange(s)} disabled={status === s}>
                  {TASK_STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Time Logs / Status Audit / Activity */}
      <Tabs defaultValue="time_logs">
        <TabsList>
          <TabsTrigger value="time_logs" className="gap-1.5"><Clock className="h-3.5 w-3.5" />Time Logs ({timeSessions.length})</TabsTrigger>
          <TabsTrigger value="status_audit" className="gap-1.5"><ArrowRightLeft className="h-3.5 w-3.5" />Status Audit ({statusChanges.length})</TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Activity ({comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="time_logs">
          <Card>
            <CardContent className="p-0">
              {timeSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Staff</th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Start</th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">End</th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Duration</th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeSessions.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).map(session => (
                        <tr key={session.id} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="py-2.5 px-4 font-medium">{getUserName(session.user_id)}</td>
                          <td className="py-2.5 px-4 text-muted-foreground">{formatDateTime(session.start_time)}</td>
                          <td className="py-2.5 px-4 text-muted-foreground">{session.end_time ? formatDateTime(session.end_time) : '—'}</td>
                          <td className="py-2.5 px-4">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {session.duration_minutes ? formatDuration(session.duration_minutes) : 'Running...'}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground text-xs max-w-[200px] truncate">{session.notes ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30 font-medium">
                        <td colSpan={3} className="py-2.5 px-4 text-sm">Total</td>
                        <td className="py-2.5 px-4">
                          <Badge className="font-mono text-xs">{formatDuration(totalMinutes)}</Badge>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No time sessions logged yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status_audit">
          <Card>
            <CardContent className="pt-6">
              {statusChanges.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {statusChanges.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()).map(change => (
                      <div key={change.id} className="relative pl-10">
                        <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <div className="border rounded-lg p-3 bg-muted/10">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                            <span className="text-sm font-medium">{getUserName(change.user_id)}</span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(change.changed_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <TaskStatusBadge status={change.from_status} />
                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                            <TaskStatusBadge status={change.to_status} />
                          </div>
                          {change.notes && <p className="text-xs text-muted-foreground mt-2">{change.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No status changes recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="space-y-4 pt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
