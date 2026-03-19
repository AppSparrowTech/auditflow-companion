import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CLIENT_MEMBER_ROLES, ClientMember } from '@/types';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberDialogProps {
  clientId: string;
  onAdd: (member: ClientMember) => void;
}

export function AddMemberDialog({ clientId, onAdd }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: 'Director',
    email: '',
    phone: '',
    pan: '',
    din: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.error('Name and role are required');
      return;
    }
    const newMember: ClientMember = {
      id: 'm' + Date.now(),
      client_id: clientId,
      name: form.name,
      role: form.role,
      email: form.email || undefined,
      phone: form.phone || undefined,
      pan: form.pan || undefined,
      din: form.din || undefined,
      created_at: new Date().toISOString(),
    };
    onAdd(newMember);
    toast.success(`Member "${newMember.name}" added`);
    setForm({ name: '', role: 'Director', email: '', phone: '', pan: '', din: '' });
    setOpen(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><UserPlus className="h-4 w-4 mr-1" /> Add Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="member_name">Name *</Label>
              <Input id="member_name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Mr. Ravi Kumar" />
            </div>
            <div>
              <Label htmlFor="member_role">Role *</Label>
              <Select value={form.role} onValueChange={v => update('role', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLIENT_MEMBER_ROLES.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="member_phone">Phone</Label>
              <Input id="member_phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210" />
            </div>
            <div>
              <Label htmlFor="member_email">Email</Label>
              <Input id="member_email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="member@example.com" />
            </div>
            <div>
              <Label htmlFor="member_pan">PAN</Label>
              <Input id="member_pan" value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="AAACB1234K" maxLength={10} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="member_din">DIN (if applicable)</Label>
              <Input id="member_din" value={form.din} onChange={e => update('din', e.target.value)} placeholder="01234567" maxLength={8} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
