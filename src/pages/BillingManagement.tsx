import { useState, useMemo } from 'react';
import { mockInvoices, mockClients, mockEngagements } from '@/data/mockData';
import { INVOICE_STATUS_LABELS, InvoiceStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, AlertTriangle, CheckCircle2, Clock, FileText, Search } from 'lucide-react';
import { formatDateIN } from '@/lib/dateUtils';

const statusStyles: Record<InvoiceStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-50 text-blue-700',
  paid: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-700',
  cancelled: 'bg-muted text-muted-foreground line-through',
};

export default function BillingManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.client_name ?? '';
  const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const filtered = useMemo(() => mockInvoices.filter(inv => {
    const matchSearch = !search || inv.invoice_number.toLowerCase().includes(search.toLowerCase()) || getClientName(inv.client_id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  }), [search, statusFilter]);

  const totalBilled = mockInvoices.reduce((s, i) => s + i.total_amount, 0);
  const totalCollected = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.paid_amount ?? 0), 0);
  const totalOutstanding = mockInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total_amount, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total_amount, 0);

  const summaryCards = [
    { label: 'Total Billed', value: formatCurrency(totalBilled), icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Collected', value: formatCurrency(totalCollected), icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: 'Outstanding', value: formatCurrency(totalOutstanding), icon: Clock, color: 'text-orange-600 bg-orange-50' },
    { label: 'Overdue', value: formatCurrency(totalOverdue), icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Billing & Fees</h2>
        <p className="text-muted-foreground text-sm">Invoice management and payment tracking</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices or clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(INVOICE_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">GST (18%)</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 font-mono text-xs font-medium">{inv.invoice_number}</td>
                    <td className="py-3 px-4 text-muted-foreground">{getClientName(inv.client_id)}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{inv.description}</td>
                    <td className="py-3 px-4 text-xs">{formatDateIN(inv.date)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{formatCurrency(inv.amount)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-muted-foreground">{formatCurrency(inv.gst_amount)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-medium">{formatCurrency(inv.total_amount)}</td>
                    <td className="py-3 px-4 text-xs">{formatDateIN(inv.due_date)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-xs ${statusStyles[inv.status]}`}>
                        {INVOICE_STATUS_LABELS[inv.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">No invoices match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding by Client */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4" /> Outstanding Fees by Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockClients.map(client => {
              const clientInvoices = mockInvoices.filter(i => i.client_id === client.id && (i.status === 'sent' || i.status === 'overdue'));
              const outstanding = clientInvoices.reduce((s, i) => s + i.total_amount, 0);
              if (outstanding === 0) return null;
              return (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{client.client_name}</p>
                    <p className="text-xs text-muted-foreground">{clientInvoices.length} unpaid invoice(s)</p>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{formatCurrency(outstanding)}</span>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
