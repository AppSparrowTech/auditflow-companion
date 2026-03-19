import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockClients, mockTasks, mockUsers, mockMembers, mockEngagements, mockDocuments } from '@/data/mockData';
import { CLIENT_TYPE_LABELS, TASK_TYPE_LABELS, ENGAGEMENT_STATUS_LABELS, ClientMember } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeadlineIndicator } from '@/components/DeadlineIndicator';
import { ArrowLeft, Building2, Phone, Mail, FileText, Users, Trash2, Briefcase, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMemberDialog } from '@/components/AddMemberDialog';
import { toast } from 'sonner';
import { formatDateIN } from '@/lib/dateUtils';

export default function ClientDetail() {
  const { id } = useParams();
  const client = mockClients.find(c => c.id === id);

  const tasks = client ? mockTasks.filter(t => t.client_id === client.id) : [];
  const engagements = client ? mockEngagements.filter(e => e.client_id === client.id) : [];
  const documents = client ? mockDocuments.filter(d => d.client_id === client.id) : [];
  const getAssigneeName = (uid: string) => mockUsers.find(u => u.id === uid)?.name ?? '';

  const [members, setMembers] = useState<ClientMember[]>(
    mockMembers.filter(m => m.client_id === id)
  );

  if (!client) return <p className="text-muted-foreground p-8">Client not found.</p>;

  const handleAddMember = (member: ClientMember) => {
    mockMembers.push(member);
    setMembers(prev => [...prev, member]);
  };

  const handleRemoveMember = (memberId: string) => {
    const idx = mockMembers.findIndex(m => m.id === memberId);
    if (idx > -1) mockMembers.splice(idx, 1);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success('Member removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/clients">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{client.client_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{CLIENT_TYPE_LABELS[client.client_type]}</Badge>
            <span className="text-xs text-muted-foreground">File: {client.file_number}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Contact Info</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />{client.contact_person}</p>
            <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{client.contact_phone}</p>
            {client.contact_email && <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{client.contact_email}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">KYC / Tax Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1.5">
            {client.pan && <p><span className="text-muted-foreground">PAN:</span> <span className="font-mono text-xs">{client.pan}</span></p>}
            {client.gstin && <p><span className="text-muted-foreground">GSTIN:</span> <span className="font-mono text-xs">{client.gstin}</span></p>}
            {client.cin && <p><span className="text-muted-foreground">CIN:</span> <span className="font-mono text-xs">{client.cin}</span></p>}
            {client.tan && <p><span className="text-muted-foreground">TAN:</span> <span className="font-mono text-xs">{client.tan}</span></p>}
            {!client.pan && !client.gstin && !client.cin && !client.tan && <p className="text-muted-foreground">No KYC details</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">{client.notes || 'No notes'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Members ({members.length})
            </CardTitle>
            <AddMemberDialog clientId={client.id} onAdd={handleAddMember} />
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No members added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">PAN</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">DIN</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{member.name}</td>
                      <td className="py-2.5"><Badge variant="secondary" className="text-xs">{member.role}</Badge></td>
                      <td className="py-2.5 text-muted-foreground">{member.phone || '—'}</td>
                      <td className="py-2.5 text-muted-foreground">{member.email || '—'}</td>
                      <td className="py-2.5 text-muted-foreground font-mono text-xs">{member.pan || '—'}</td>
                      <td className="py-2.5 text-muted-foreground font-mono text-xs">{member.din || '—'}</td>
                      <td className="py-2.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveMember(member.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagements Section */}
      {engagements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Engagements ({engagements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Engagement</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Staff</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {engagements.map(eng => (
                    <tr key={eng.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{eng.title}</td>
                      <td className="py-2.5 text-muted-foreground text-xs">{TASK_TYPE_LABELS[eng.type]}</td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {eng.assigned_staff.map(uid => (
                            <Badge key={uid} variant="secondary" className="text-[10px]">{getAssigneeName(uid)}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5">
                        <Badge variant="outline" className="text-xs">{ENGAGEMENT_STATUS_LABELS[eng.status]}</Badge>
                      </td>
                      <td className="py-2.5">
                        <DeadlineIndicator dueDate={eng.due_date} status={eng.status === 'completed' || eng.status === 'filed' ? 'completed' : 'in_progress'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Document</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Uploaded</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{doc.name}</td>
                      <td className="py-2.5"><Badge variant="secondary" className="text-[10px]">{doc.category}</Badge></td>
                      <td className="py-2.5 text-xs text-muted-foreground">{formatDateIN(doc.upload_date)}</td>
                      <td className="py-2.5">
                        <Badge variant="outline" className="text-xs capitalize">{doc.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" /> Tasks ({tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Assigned</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2.5"><Link to={`/admin/tasks/${task.id}`} className="font-medium hover:text-primary">{task.title}</Link></td>
                    <td className="py-2.5 text-muted-foreground">{TASK_TYPE_LABELS[task.task_type]}</td>
                    <td className="py-2.5 text-muted-foreground">{getAssigneeName(task.assigned_to)}</td>
                    <td className="py-2.5"><TaskStatusBadge status={task.status} /></td>
                    <td className="py-2.5"><PriorityBadge priority={task.priority} /></td>
                    <td className="py-2.5"><DeadlineIndicator dueDate={task.due_date} status={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
