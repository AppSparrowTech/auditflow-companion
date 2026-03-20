export type UserRole = 'admin' | 'manager' | 'article' | 'client_primary' | 'client_secondary' | 'billing_staff';
export type ClientType = 'individual' | 'partnership' | 'company' | 'llp' | 'proprietorship' | 'trust' | 'hospital' | 'other';
export type TaskType = 'itr_filing' | 'gst_return' | 'tds_return' | 'statutory_audit' | 'tax_audit' | 'gst_audit' | 'internal_audit' | 'bookkeeping' | 'roc_compliance' | 'other';
export type TaskStatus = 'not_started' | 'started' | 'in_progress' | 'waiting_for_customer' | 'pending' | 'on_hold' | 'under_review' | 'completed' | 'filed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EngagementStatus = 'not_started' | 'in_progress' | 'review' | 'completed' | 'filed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  designation?: string;
  created_at: string;
}

export interface Client {
  id: string;
  client_name: string;
  client_type: ClientType;
  file_number: string;
  pan?: string;
  gstin?: string;
  cin?: string;
  tan?: string;
  contact_person: string;
  contact_email?: string;
  contact_phone: string;
  linked_user_id?: string;
  notes?: string;
  created_at: string;
}

export interface Engagement {
  id: string;
  client_id: string;
  type: TaskType;
  title: string;
  description?: string;
  financial_year: string;
  assessment_year?: string;
  status: EngagementStatus;
  assigned_staff: string[]; // user IDs
  lead_partner_id: string;
  due_date: string;
  start_date?: string;
  completed_date?: string;
  fee_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  client_id: string;
  engagement_id?: string;
  task_type: TaskType;
  title: string;
  description?: string;
  assigned_to: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  start_date?: string;
  completed_date?: string;
  financial_year: string;
  assessment_year?: string;
  parent_task_id?: string; // for subtasks
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface TimeSession {
  id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number; // computed when ended
  notes?: string;
}

export interface TaskStatusChange {
  id: string;
  task_id: string;
  user_id: string;
  from_status: TaskStatus;
  to_status: TaskStatus;
  changed_at: string;
  notes?: string;
}

export interface ClientMember {
  id: string;
  client_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  pan?: string;
  din?: string;
  created_at: string;
}

export interface ComplianceDeadline {
  id: string;
  type: string;
  title: string;
  description: string;
  due_date: string;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  applicable_to: ClientType[];
}

export interface Invoice {
  id: string;
  client_id: string;
  engagement_id?: string;
  invoice_number: string;
  date: string;
  due_date: string;
  amount: number;
  gst_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  description: string;
  paid_date?: string;
  paid_amount?: number;
  created_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  engagement_id?: string;
  name: string;
  category: string;
  financial_year: string;
  uploaded_by: string;
  upload_date: string;
  status: 'pending' | 'received' | 'verified' | 'rejected';
  version: number;
  notes?: string;
}

export const CLIENT_MEMBER_ROLES = [
  'Director',
  'Partner',
  'Proprietor',
  'Authorized Signatory',
  'Accountant',
  'Trustee',
  'Secretary',
  'Key Managerial Person',
  'CFO',
  'Bookkeeper',
  'Other',
] as const;

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  itr_filing: 'ITR Filing',
  gst_return: 'GST Return',
  tds_return: 'TDS Return',
  statutory_audit: 'Statutory Audit',
  tax_audit: 'Tax Audit',
  gst_audit: 'GST Audit',
  internal_audit: 'Internal Audit',
  bookkeeping: 'Bookkeeping',
  roc_compliance: 'ROC Compliance',
  other: 'Other',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  started: 'Started',
  in_progress: 'In Progress',
  waiting_for_customer: 'Waiting for Customer Input',
  pending: 'Pending',
  on_hold: 'On Hold',
  under_review: 'Under Review',
  completed: 'Completed',
  filed: 'Filed',
};

export const TASK_TYPE_COLORS: Record<TaskType, { bg: string; text: string; border: string }> = {
  itr_filing: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  gst_return: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  tds_return: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  statutory_audit: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  tax_audit: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  gst_audit: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  internal_audit: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  bookkeeping: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  roc_compliance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  other: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  individual: 'Individual',
  partnership: 'Partnership Firm',
  company: 'Pvt Ltd / Company',
  llp: 'LLP',
  proprietorship: 'Proprietorship',
  trust: 'Trust',
  hospital: 'Hospital',
  other: 'Other',
};

export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  review: 'Under Review',
  completed: 'Completed',
  filed: 'Filed',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Partner / Admin',
  manager: 'Manager',
  article: 'Article / Staff',
  client_primary: 'Client (Primary)',
  client_secondary: 'Client (Secondary)',
  billing_staff: 'Billing Staff',
};
