import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CLIENT_TYPE_LABELS, ClientType, Client } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddClientDialogProps {
  onAdd: (client: Client) => void;
}

export function AddClientDialog({ onAdd }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client_name: '',
    client_type: 'individual' as ClientType,
    file_number: '',
    pan: '',
    gstin: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.file_number || !form.contact_person || !form.contact_phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newClient: Client = {
      id: 'c' + Date.now(),
      client_name: form.client_name,
      client_type: form.client_type,
      file_number: form.file_number,
      pan: form.pan || undefined,
      gstin: form.gstin || undefined,
      contact_person: form.contact_person,
      contact_email: form.contact_email || undefined,
      contact_phone: form.contact_phone,
      notes: form.notes || undefined,
      created_at: new Date().toISOString(),
    };
    onAdd(newClient);
    toast.success(`Client "${newClient.client_name}" added successfully`);
    setForm({ client_name: '', client_type: 'individual', file_number: '', pan: '', gstin: '', contact_person: '', contact_email: '', contact_phone: '', notes: '' });
    setOpen(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Client</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input id="client_name" value={form.client_name} onChange={e => update('client_name', e.target.value)} placeholder="e.g. KMCH Hospital" />
            </div>
            <div>
              <Label htmlFor="client_type">Client Type *</Label>
              <Select value={form.client_type} onValueChange={v => update('client_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CLIENT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file_number">File Number *</Label>
              <Input id="file_number" value={form.file_number} onChange={e => update('file_number', e.target.value)} placeholder="e.g. F-006" />
            </div>
            <div>
              <Label htmlFor="pan">PAN</Label>
              <Input id="pan" value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="AAACB1234K" maxLength={10} />
            </div>
            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" value={form.gstin} onChange={e => update('gstin', e.target.value.toUpperCase())} placeholder="33AAACB1234K1Z5" maxLength={15} />
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3 text-muted-foreground">Contact Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input id="contact_person" value={form.contact_person} onChange={e => update('contact_person', e.target.value)} placeholder="Mr. Anand" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="contact_phone">Phone *</Label>
                <Input id="contact_phone" value={form.contact_phone} onChange={e => update('contact_phone', e.target.value)} placeholder="9876543210" maxLength={10} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input id="contact_email" type="email" value={form.contact_email} onChange={e => update('contact_email', e.target.value)} placeholder="client@example.com" />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any additional notes..." rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
