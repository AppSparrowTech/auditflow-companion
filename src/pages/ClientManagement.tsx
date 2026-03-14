import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockClients, mockTasks } from '@/data/mockData';
import { CLIENT_TYPE_LABELS, ClientType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Building2 } from 'lucide-react';

export default function ClientManagement() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = mockClients.filter(c => {
    const matchesSearch = !search || 
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.file_number.toLowerCase().includes(search.toLowerCase()) ||
      c.pan?.toLowerCase().includes(search.toLowerCase()) ||
      c.gstin?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || c.client_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clients</h2>
          <p className="text-muted-foreground text-sm">{mockClients.length} client files</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, file number, PAN, GSTIN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(CLIENT_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(client => {
          const taskCount = mockTasks.filter(t => t.client_id === client.id).length;
          const activeCount = mockTasks.filter(t => t.client_id === client.id && t.status !== 'completed').length;
          return (
            <Link key={client.id} to={`/admin/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm truncate">{client.client_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{client.file_number}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{CLIENT_TYPE_LABELS[client.client_type]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Contact: {client.contact_person}</p>
                    {client.pan && <p>PAN: {client.pan}</p>}
                    <div className="flex gap-3 pt-2 border-t mt-2">
                      <span>{taskCount} tasks</span>
                      <span className="text-primary font-medium">{activeCount} active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
