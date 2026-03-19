import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockEngagements, mockClients, mockUsers } from '@/data/mockData';
import { TASK_TYPE_LABELS, ENGAGEMENT_STATUS_LABELS, EngagementStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { Search, Briefcase } from 'lucide-react';
import { formatDateIN } from '@/lib/dateUtils';

const statusStyles: Record<EngagementStatus, string> = {
  not_started: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-50 text-blue-700',
  review: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
  filed: 'bg-emerald-50 text-emerald-700',
};

export default function EngagementManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';
  const getUserName = (id: string) => mockUsers.find(u => u.id === id)?.name ?? '';
  const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const filtered = useMemo(() => mockEngagements.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || getClientName(e.client_id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchType = typeFilter === 'all' || e.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }), [search, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Engagements</h2>
        <p className="text-muted-foreground text-sm">{mockEngagements.length} total engagements</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search engagements..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(ENGAGEMENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TASK_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Engagement</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Staff</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Fee</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Due</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">FY</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(eng => (
                  <tr key={eng.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">{eng.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/admin/clients/${eng.client_id}`} className="text-muted-foreground hover:text-primary">{getClientName(eng.client_id)}</Link>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{TASK_TYPE_LABELS[eng.type]}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {eng.assigned_staff.map(uid => (
                          <Badge key={uid} variant="secondary" className="text-[10px]">{getUserName(uid)}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-xs ${statusStyles[eng.status]}`}>
                        {ENGAGEMENT_STATUS_LABELS[eng.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs font-mono">
                      {eng.fee_amount ? formatCurrency(eng.fee_amount) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <DeadlineIndicator dueDate={eng.due_date} status={eng.status === 'completed' || eng.status === 'filed' ? 'completed' : 'in_progress'} />
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{eng.financial_year}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No engagements match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
