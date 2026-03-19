import { User, Client, Task, TaskComment, ClientMember } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin (Uncle)', email: 'admin@auditflow.in', role: 'admin', phone: '9876543210', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'Bobin', email: 'bobin@auditflow.in', role: 'employee', phone: '9876543211', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u3', name: 'Supriya', email: 'supriya@auditflow.in', role: 'employee', phone: '9876543212', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u4', name: 'Jagruti', email: 'jagruti@auditflow.in', role: 'employee', phone: '9876543213', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u5', name: 'KMCH Admin', email: 'admin@kmch.in', role: 'client', created_at: '2024-06-01T00:00:00Z' },
  { id: 'u6', name: 'Ramesh Kumar', email: 'ramesh@email.com', role: 'client', created_at: '2024-06-01T00:00:00Z' },
];

export const mockClients: Client[] = [
  { id: 'c1', client_name: 'KMCH Hospital', client_type: 'hospital', file_number: 'F-001', pan: 'AABCK1234H', gstin: '33AABCK1234H1Z5', contact_person: 'Dr. Nithya', contact_email: 'nithya@kmch.in', contact_phone: '9876500001', linked_user_id: 'u5', notes: 'Major hospital client. Quarterly audits required.', created_at: '2024-01-15T00:00:00Z' },
  { id: 'c2', client_name: 'Royal Care Hospital', client_type: 'hospital', file_number: 'F-002', pan: 'AABCR5678K', gstin: '33AABCR5678K1Z3', contact_person: 'Mr. Suresh', contact_phone: '9876500002', notes: 'New client since 2024.', created_at: '2024-03-01T00:00:00Z' },
  { id: 'c3', client_name: 'Ramesh Kumar', client_type: 'individual', file_number: 'F-003', pan: 'BKRPK1234A', contact_person: 'Ramesh Kumar', contact_email: 'ramesh@email.com', contact_phone: '9876500003', linked_user_id: 'u6', created_at: '2024-02-01T00:00:00Z' },
  { id: 'c4', client_name: 'ABC Traders', client_type: 'partnership', file_number: 'F-004', pan: 'AACFA9876B', gstin: '33AACFA9876B1Z1', contact_person: 'Mr. Anand', contact_phone: '9876500004', created_at: '2024-01-20T00:00:00Z' },
  { id: 'c5', client_name: 'XYZ Pvt Ltd', client_type: 'company', file_number: 'F-005', pan: 'AABCX4321D', gstin: '33AABCX4321D1Z7', contact_person: 'Ms. Priya', contact_email: 'priya@xyz.co.in', contact_phone: '9876500005', notes: 'ROC compliance critical.', created_at: '2024-04-01T00:00:00Z' },
];

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10);
const daysFromNow = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

export const mockTasks: Task[] = [
  { id: 't1', client_id: 'c1', task_type: 'statutory_audit', title: 'Statutory Audit FY 2024-25', assigned_to: 'u2', status: 'in_progress', priority: 'high', due_date: daysFromNow(15), start_date: daysAgo(30), financial_year: '2024-25', created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 't2', client_id: 'c1', task_type: 'gst_return', title: 'GST 3B - Feb 2025', assigned_to: 'u3', status: 'completed', priority: 'high', due_date: daysAgo(5), start_date: daysAgo(15), completed_date: daysAgo(6), financial_year: '2024-25', created_at: daysAgo(20), updated_at: daysAgo(6) },
  { id: 't3', client_id: 'c1', task_type: 'gst_return', title: 'GST 3B - Mar 2025', assigned_to: 'u3', status: 'not_started', priority: 'high', due_date: daysFromNow(2), financial_year: '2024-25', created_at: daysAgo(5), updated_at: daysAgo(5) },
  { id: 't4', client_id: 'c2', task_type: 'internal_audit', title: 'Internal Audit Q4 2024-25', assigned_to: 'u2', status: 'under_review', priority: 'medium', due_date: daysFromNow(5), start_date: daysAgo(20), financial_year: '2024-25', created_at: daysAgo(25), updated_at: daysAgo(1) },
  { id: 't5', client_id: 'c3', task_type: 'itr_filing', title: 'ITR Filing AY 2025-26', assigned_to: 'u4', status: 'not_started', priority: 'medium', due_date: daysFromNow(120), financial_year: '2024-25', assessment_year: '2025-26', created_at: daysAgo(10), updated_at: daysAgo(10) },
  { id: 't6', client_id: 'c4', task_type: 'gst_return', title: 'GST 3B - Feb 2025', assigned_to: 'u4', status: 'completed', priority: 'high', due_date: daysAgo(5), completed_date: daysAgo(7), financial_year: '2024-25', created_at: daysAgo(20), updated_at: daysAgo(7) },
  { id: 't7', client_id: 'c4', task_type: 'bookkeeping', title: 'Bookkeeping - March 2025', assigned_to: 'u4', status: 'in_progress', priority: 'low', due_date: daysFromNow(10), start_date: daysAgo(3), financial_year: '2024-25', created_at: daysAgo(5), updated_at: daysAgo(1) },
  { id: 't8', client_id: 'c5', task_type: 'roc_compliance', title: 'Annual ROC Filing FY 2024-25', assigned_to: 'u2', status: 'on_hold', priority: 'urgent', due_date: daysAgo(3), financial_year: '2024-25', created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 't9', client_id: 'c5', task_type: 'tds_return', title: 'TDS Return Q4 FY 2024-25', assigned_to: 'u3', status: 'in_progress', priority: 'high', due_date: daysFromNow(1), start_date: daysAgo(5), financial_year: '2024-25', created_at: daysAgo(10), updated_at: daysAgo(1) },
  { id: 't10', client_id: 'c2', task_type: 'gst_return', title: 'GST 3B - Mar 2025', assigned_to: 'u3', status: 'not_started', priority: 'high', due_date: daysAgo(1), financial_year: '2024-25', created_at: daysAgo(10), updated_at: daysAgo(10) },
];

export const mockComments: TaskComment[] = [
  { id: 'cm1', task_id: 't1', user_id: 'u2', comment: 'Started fieldwork at KMCH. Collecting vouchers and ledgers.', created_at: daysAgo(25) + 'T10:00:00Z' },
  { id: 'cm2', task_id: 't1', user_id: 'u1', comment: 'Please prioritize the fixed assets schedule.', created_at: daysAgo(20) + 'T14:00:00Z' },
  { id: 'cm3', task_id: 't1', user_id: 'u2', comment: 'Fixed assets schedule completed. Moving to revenue verification.', created_at: daysAgo(10) + 'T09:30:00Z' },
  { id: 'cm4', task_id: 't4', user_id: 'u2', comment: 'Draft report submitted for review.', created_at: daysAgo(3) + 'T16:00:00Z' },
  { id: 'cm5', task_id: 't4', user_id: 'u1', comment: 'Reviewed. Minor observations on inventory valuation. Please revise.', created_at: daysAgo(1) + 'T11:00:00Z' },
  { id: 'cm6', task_id: 't8', user_id: 'u1', comment: 'On hold — waiting for board resolution from client.', created_at: daysAgo(5) + 'T13:00:00Z' },
  { id: 'cm7', task_id: 't9', user_id: 'u3', comment: 'Collecting Form 16A from all deductees.', created_at: daysAgo(3) + 'T10:00:00Z' },
];
