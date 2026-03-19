import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      // Route based on role
      if (email.includes('admin')) navigate('/admin');
      else if (email.includes('kmch') || email.includes('ramesh') || email.includes('ravi')) navigate('/portal');
      else navigate('/employee');
    } else {
      toast({ title: 'Login failed', description: 'Invalid email. Try one of the demo accounts below.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-primary flex items-center justify-center mb-4">
            <FileText className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AuditFlow</h1>
          <p className="text-muted-foreground mt-1">Indian Auditor Management Platform</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your email to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@auditflow.in" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Any password (demo)" />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Partner/Admin:</span> admin@auditflow.in</p>
              <p><span className="font-medium text-foreground">Managers:</span> arun@auditflow.in / karthick@auditflow.in</p>
              <p><span className="font-medium text-foreground">Articles/Staff:</span> nandini@auditflow.in / divya@auditflow.in</p>
              <p><span className="font-medium text-foreground">Billing:</span> meena@auditflow.in</p>
              <p><span className="font-medium text-foreground">Client:</span> admin@kmch.in / ramesh@email.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
