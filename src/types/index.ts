export type UserRole = 'admin' | 'employee' | 'client';
export type ClientType = 'individual' | 'partnership' | 'company' | 'trust' | 'hospital' | 'other';
export type TaskType = 'itr_filing' | 'gst_return' | 'tds_return' | 'statutory_audit' | 'internal_audit' | 'bookkeeping' | 'roc_compliance' | 'other';
export type TaskStatus = 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Client {
  id: string;
  client_name: string;
  client_type: ClientType;
  file_number: string;
  pan?: string;
  gstin?: string;
  contact_person: string;
  contact_email?: string;
  contact_phone: string;
  linked_user_id?: string;
  notes?: string;
  created_at: string;
}

export interface Task {
  id: string;
  client_id: string;
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

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  itr_filing: 'ITR Filing',
  gst_return: 'GST Return',
  tds_return: 'TDS Return',
  statutory_audit: 'Statutory Audit',
  internal_audit: 'Internal Audit',
  bookkeeping: 'Bookkeeping',
  roc_compliance: 'ROC Compliance',
  other: 'Other',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  individual: 'Individual',
  partnership: 'Partnership',
  company: 'Company',
  trust: 'Trust',
  hospital: 'Hospital',
  other: 'Other',
};
