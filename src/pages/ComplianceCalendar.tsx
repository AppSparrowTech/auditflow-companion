import { useState, useMemo } from 'react';
import { complianceDeadlines, mockClients } from '@/data/mockData';
import { CLIENT_TYPE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getDaysUntilDue, formatDateIN } from '@/lib/dateUtils';

export default function ComplianceCalendar() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const deadlineTypes = useMemo(() => [...new Set(complianceDeadlines.map(d => d.type))], []);

  const filtered = useMemo(() => complianceDeadlines.filter(d => {
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    const matchMonth = monthFilter === 'all' || new Date(d.due_date).getMonth() === parseInt(monthFilter);
    return matchType && matchMonth;
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()), [typeFilter, monthFilter]);

  const getUrgencyBadge = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
    if (days <= 7) return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">Due Soon</Badge>;
    if (days <= 30) return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Upcoming</Badge>;
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">On Track</Badge>;
  };

  const frequencyBadge = (freq: string) => {
    const colors: Record<string, string> = {
      monthly: 'bg-blue-50 text-blue-700',
      quarterly: 'bg-purple-50 text-purple-700',
      annual: 'bg-amber-50 text-amber-700',
      one_time: 'bg-muted text-muted-foreground',
    };
    return <Badge variant="outline" className={`text-[10px] capitalize ${colors[freq] || ''}`}>{freq.replace('_', ' ')}</Badge>;
  };

  // Per-client deadline tracker
  const clientDeadlines = useMemo(() => {
    return mockClients.map(client => {
      const applicable = complianceDeadlines.filter(d => d.applicable_to.includes(client.client_type));
      const overdue = applicable.filter(d => getDaysUntilDue(d.due_date) < 0);
      const upcoming = applicable.filter(d => { const dd = getDaysUntilDue(d.due_date); return dd >= 0 && dd <= 30; });
      return { client, total: applicable.length, overdue: overdue.length, upcoming: upcoming.length };
    }).filter(c => c.total > 0);
  }, []);

  const months = [
    { value: '0', label: 'January' }, { value: '1', label: 'February' }, { value: '2', label: 'March' },
    { value: '3', label: 'April' }, { value: '4', label: 'May' }, { value: '5', label: 'June' },
    { value: '6', label: 'July' }, { value: '7', label: 'August' }, { value: '8', label: 'September' },
    { value: '9', label: 'October' }, { value: '10', label: 'November' }, { value: '11', label: 'December' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Compliance Calendar</h2>
        <p className="text-muted-foreground text-sm">Pre-loaded Indian compliance deadlines — ITR, TDS, GST, ROC, MCA</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Deadlines</p>
                <p className="text-2xl font-bold text-foreground mt-1">{complianceDeadlines.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600"><Calendar className="h-5 w-5" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground mt-1">{complianceDeadlines.filter(d => getDaysUntilDue(d.due_date) < 0).length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Due This Month</p>
                <p className="text-2xl font-bold text-foreground mt-1">{complianceDeadlines.filter(d => { const dd = getDaysUntilDue(d.due_date); return dd >= 0 && dd <= 30; }).length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600"><Clock className="h-5 w-5" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-foreground mt-1">{complianceDeadlines.filter(d => getDaysUntilDue(d.due_date) > 30).length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {deadlineTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Months" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Deadlines Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Deadline Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Compliance</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Frequency</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Applicable To</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{d.title}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{d.description}</td>
                    <td className="py-3 px-4 text-xs">{formatDateIN(d.due_date)}</td>
                    <td className="py-3 px-4">{frequencyBadge(d.frequency)}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {d.applicable_to.slice(0, 3).map(t => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{CLIENT_TYPE_LABELS[t]?.split(' ')[0] ?? t}</Badge>
                        ))}
                        {d.applicable_to.length > 3 && <Badge variant="secondary" className="text-[10px]">+{d.applicable_to.length - 3}</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getUrgencyBadge(d.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Per-Client Deadline Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Per-Client Deadline Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clientDeadlines.map(({ client, total, overdue, upcoming }) => (
              <div key={client.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{client.client_name}</span>
                  <Badge variant="outline" className="text-[10px]">{CLIENT_TYPE_LABELS[client.client_type]?.split(' ')[0]}</Badge>
                </div>
                <div className="flex gap-3 text-xs">
                  <span>{total} deadlines</span>
                  {overdue > 0 && <span className="text-red-600 font-medium">{overdue} overdue</span>}
                  {upcoming > 0 && <span className="text-orange-600 font-medium">{upcoming} upcoming</span>}
                  {overdue === 0 && upcoming === 0 && <span className="text-green-600">All clear</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
