import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockTasks, mockClients, mockUsers } from '@/data/mockData';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS } from '@/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { Search } from 'lucide-react';
import { isStaffRole } from '@/contexts/AuthContext';

export default function TaskManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const staff = mockUsers.filter(u => isStaffRole(u.role));
  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';
  const getAssigneeName = (id: string) => mockUsers.find(u => u.id === id)?.name ?? '';

  const filtered = mockTasks.filter(t => {
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || getClientName(t.client_id).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.task_type === typeFilter;
    const matchesAssignee = assigneeFilter === 'all' || t.assigned_to === assigneeFilter;
    return matchesSearch && matchesStatus && matchesType && matchesAssignee;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
        <p className="text-muted-foreground text-sm">{mockTasks.length} total tasks</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks or clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TASK_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Assignee" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            {staff.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Assigned</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Due</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">FY</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4"><Link to={`/admin/tasks/${task.id}`} className="font-medium hover:text-primary">{task.title}</Link></td>
                    <td className="py-3 px-4 text-muted-foreground">{getClientName(task.client_id)}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{TASK_TYPE_LABELS[task.task_type]}</td>
                    <td className="py-3 px-4 text-muted-foreground">{getAssigneeName(task.assigned_to)}</td>
                    <td className="py-3 px-4"><TaskStatusBadge status={task.status} /></td>
                    <td className="py-3 px-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="py-3 px-4"><DeadlineIndicator dueDate={task.due_date} status={task.status} /></td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{task.financial_year}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No tasks match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
