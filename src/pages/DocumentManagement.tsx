import { useState, useMemo } from 'react';
import { mockDocuments, mockClients, mockUsers, mockEngagements } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FolderOpen, FileCheck, FileClock, FileX, FileText } from 'lucide-react';
import { formatDateIN } from '@/lib/dateUtils';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  received: 'bg-blue-50 text-blue-700 border-blue-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  received: 'Received',
  verified: 'Verified',
  rejected: 'Rejected',
};

export default function DocumentManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';
  const getUserName = (id: string) => mockUsers.find(u => u.id === id)?.name ?? '';
  const getEngagementTitle = (id?: string) => id ? mockEngagements.find(e => e.id === id)?.title : null;

  const filtered = useMemo(() => mockDocuments.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchClient = clientFilter === 'all' || d.client_id === clientFilter;
    return matchSearch && matchStatus && matchClient;
  }), [search, statusFilter, clientFilter]);

  const categories = useMemo(() => [...new Set(mockDocuments.map(d => d.category))], []);

  const statCounts = {
    total: mockDocuments.length,
    pending: mockDocuments.filter(d => d.status === 'pending').length,
    received: mockDocuments.filter(d => d.status === 'received').length,
    verified: mockDocuments.filter(d => d.status === 'verified').length,
    rejected: mockDocuments.filter(d => d.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-muted-foreground text-sm">Client document tracking & management</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{statCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FileClock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-bold">{statCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="text-lg font-bold">{statCounts.received}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Verified</p>
                <p className="text-lg font-bold">{statCounts.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FileX className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="text-lg font-bold">{statCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {mockClients.map(c => <SelectItem key={c.id} value={c.id}>{c.client_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Document</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Engagement</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Uploaded By</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Ver.</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium">{doc.name}</span>
                        {doc.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{doc.notes}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{getClientName(doc.client_id)}</td>
                    <td className="py-3 px-4"><Badge variant="secondary" className="text-[10px]">{doc.category}</Badge></td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{getEngagementTitle(doc.engagement_id) ?? '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{getUserName(doc.uploaded_by)}</td>
                    <td className="py-3 px-4 text-xs">{formatDateIN(doc.upload_date)}</td>
                    <td className="py-3 px-4 text-xs text-center">v{doc.version}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-xs ${statusStyles[doc.status]}`}>
                        {statusLabels[doc.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No documents match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
