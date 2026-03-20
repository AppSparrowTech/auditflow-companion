import { User, Client, Task, TaskComment, ClientMember, Engagement, Invoice, ComplianceDeadline, Document, TimeSession, TaskStatusChange } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin (Partner)', email: 'admin@auditflow.in', role: 'admin', phone: '9876543210', designation: 'Senior Partner', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'Arun', email: 'arun@auditflow.in', role: 'manager', phone: '9876543211', designation: 'Audit Manager', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u3', name: 'Karthick', email: 'karthick@auditflow.in', role: 'manager', phone: '9876543212', designation: 'Tax Manager', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u4', name: 'Nandini', email: 'nandini@auditflow.in', role: 'article', phone: '9876543213', designation: 'Article Clerk', created_at: '2024-02-01T00:00:00Z' },
  { id: 'u5', name: 'Divya', email: 'divya@auditflow.in', role: 'article', phone: '9876543214', designation: 'Semi-Qualified', created_at: '2024-03-01T00:00:00Z' },
  { id: 'u6', name: 'Meena', email: 'meena@auditflow.in', role: 'billing_staff', phone: '9876543215', designation: 'Billing Executive', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u7', name: 'KMCH Admin', email: 'admin@kmch.in', role: 'client_primary', created_at: '2024-06-01T00:00:00Z' },
  { id: 'u8', name: 'Ramesh Kumar', email: 'ramesh@email.com', role: 'client_primary', created_at: '2024-06-01T00:00:00Z' },
  { id: 'u9', name: 'Ravi (KMCH Accountant)', email: 'ravi@kmch.in', role: 'client_secondary', created_at: '2024-06-01T00:00:00Z' },
];

export let mockClients: Client[] = [
  { id: 'c1', client_name: 'KMCH Hospital', client_type: 'hospital', file_number: 'F-001', pan: 'AABCK1234H', gstin: '33AABCK1234H1Z5', cin: 'U85110TN2005PTC001234', tan: 'CHEK12345A', contact_person: 'Dr. Nithya', contact_email: 'nithya@kmch.in', contact_phone: '9876500001', linked_user_id: 'u7', notes: 'Major hospital client. Quarterly audits required.', created_at: '2024-01-15T00:00:00Z' },
  { id: 'c2', client_name: 'Royal Care Hospital', client_type: 'hospital', file_number: 'F-002', pan: 'AABCR5678K', gstin: '33AABCR5678K1Z3', tan: 'CHER56789B', contact_person: 'Mr. Suresh', contact_phone: '9876500002', notes: 'New client since 2024.', created_at: '2024-03-01T00:00:00Z' },
  { id: 'c3', client_name: 'Ramesh Kumar', client_type: 'individual', file_number: 'F-003', pan: 'BKRPK1234A', contact_person: 'Ramesh Kumar', contact_email: 'ramesh@email.com', contact_phone: '9876500003', linked_user_id: 'u8', created_at: '2024-02-01T00:00:00Z' },
  { id: 'c4', client_name: 'ABC Traders', client_type: 'partnership', file_number: 'F-004', pan: 'AACFA9876B', gstin: '33AACFA9876B1Z1', tan: 'CHEA98765C', contact_person: 'Mr. Anand', contact_phone: '9876500004', created_at: '2024-01-20T00:00:00Z' },
  { id: 'c5', client_name: 'XYZ Pvt Ltd', client_type: 'company', file_number: 'F-005', pan: 'AABCX4321D', gstin: '33AABCX4321D1Z7', cin: 'U72200TN2018PTC123456', tan: 'CHEX43210D', contact_person: 'Ms. Priya', contact_email: 'priya@xyz.co.in', contact_phone: '9876500005', notes: 'ROC compliance critical.', created_at: '2024-04-01T00:00:00Z' },
  { id: 'c6', client_name: 'Kumar & Associates LLP', client_type: 'llp', file_number: 'F-006', pan: 'AAFFL5678E', gstin: '33AAFFL5678E1Z2', cin: 'AAB-1234', contact_person: 'Mr. Kumar', contact_email: 'kumar@kumarlegal.in', contact_phone: '9876500006', notes: 'LLP compliance + GST.', created_at: '2024-05-01T00:00:00Z' },
  { id: 'c7', client_name: 'Sree Textiles', client_type: 'proprietorship', file_number: 'F-007', pan: 'BKRPS9876F', gstin: '33BKRPS9876F1Z4', contact_person: 'Mr. Sreenivasan', contact_phone: '9876500007', created_at: '2024-06-01T00:00:00Z' },
];

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10);
const daysFromNow = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

export let mockEngagements: Engagement[] = [
  { id: 'e1', client_id: 'c1', type: 'statutory_audit', title: 'Statutory Audit FY 2024-25', financial_year: '2024-25', status: 'in_progress', assigned_staff: ['u2', 'u4'], lead_partner_id: 'u1', due_date: daysFromNow(15), start_date: daysAgo(30), fee_amount: 250000, created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 'e2', client_id: 'c1', type: 'gst_return', title: 'GST Returns FY 2024-25', financial_year: '2024-25', status: 'in_progress', assigned_staff: ['u3', 'u5'], lead_partner_id: 'u1', due_date: daysFromNow(2), fee_amount: 60000, created_at: daysAgo(300), updated_at: daysAgo(5) },
  { id: 'e3', client_id: 'c2', type: 'internal_audit', title: 'Internal Audit Q4 2024-25', financial_year: '2024-25', status: 'review', assigned_staff: ['u2'], lead_partner_id: 'u1', due_date: daysFromNow(5), start_date: daysAgo(20), fee_amount: 100000, created_at: daysAgo(25), updated_at: daysAgo(1) },
  { id: 'e4', client_id: 'c3', type: 'itr_filing', title: 'ITR Filing AY 2025-26', financial_year: '2024-25', assessment_year: '2025-26', status: 'not_started', assigned_staff: ['u4'], lead_partner_id: 'u1', due_date: daysFromNow(120), fee_amount: 5000, created_at: daysAgo(10), updated_at: daysAgo(10) },
  { id: 'e5', client_id: 'c5', type: 'roc_compliance', title: 'Annual ROC Filing FY 2024-25', financial_year: '2024-25', status: 'not_started', assigned_staff: ['u2', 'u5'], lead_partner_id: 'u1', due_date: daysAgo(3), fee_amount: 35000, created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 'e6', client_id: 'c4', type: 'tax_audit', title: 'Tax Audit FY 2024-25', financial_year: '2024-25', status: 'not_started', assigned_staff: ['u3', 'u4'], lead_partner_id: 'u1', due_date: daysFromNow(60), fee_amount: 40000, created_at: daysAgo(5), updated_at: daysAgo(5) },
  { id: 'e7', client_id: 'c6', type: 'gst_audit', title: 'GST Audit FY 2024-25', financial_year: '2024-25', status: 'in_progress', assigned_staff: ['u3'], lead_partner_id: 'u1', due_date: daysFromNow(30), start_date: daysAgo(10), fee_amount: 50000, created_at: daysAgo(15), updated_at: daysAgo(3) },
  { id: 'e8', client_id: 'c7', type: 'bookkeeping', title: 'Bookkeeping FY 2024-25', financial_year: '2024-25', status: 'in_progress', assigned_staff: ['u5'], lead_partner_id: 'u1', due_date: daysFromNow(10), start_date: daysAgo(60), fee_amount: 24000, created_at: daysAgo(60), updated_at: daysAgo(1) },
];

export const mockTasks: Task[] = [
  { id: 't1', client_id: 'c1', engagement_id: 'e1', task_type: 'statutory_audit', title: 'Statutory Audit FY 2024-25', assigned_to: 'u2', status: 'in_progress', priority: 'high', due_date: daysFromNow(15), start_date: daysAgo(30), financial_year: '2024-25', created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 't1a', client_id: 'c1', engagement_id: 'e1', task_type: 'statutory_audit', title: 'Collect vouchers & ledgers', assigned_to: 'u4', status: 'completed', priority: 'high', due_date: daysAgo(10), start_date: daysAgo(28), completed_date: daysAgo(12), financial_year: '2024-25', parent_task_id: 't1', created_at: daysAgo(28), updated_at: daysAgo(12) },
  { id: 't1b', client_id: 'c1', engagement_id: 'e1', task_type: 'statutory_audit', title: 'Fixed assets schedule', assigned_to: 'u4', status: 'in_progress', priority: 'medium', due_date: daysFromNow(5), start_date: daysAgo(10), financial_year: '2024-25', parent_task_id: 't1', created_at: daysAgo(10), updated_at: daysAgo(2) },
  { id: 't2', client_id: 'c1', engagement_id: 'e2', task_type: 'gst_return', title: 'GST 3B - Feb 2025', assigned_to: 'u3', status: 'completed', priority: 'high', due_date: daysAgo(5), start_date: daysAgo(15), completed_date: daysAgo(6), financial_year: '2024-25', created_at: daysAgo(20), updated_at: daysAgo(6) },
  { id: 't3', client_id: 'c1', engagement_id: 'e2', task_type: 'gst_return', title: 'GST 3B - Mar 2025', assigned_to: 'u5', status: 'not_started', priority: 'high', due_date: daysFromNow(2), financial_year: '2024-25', created_at: daysAgo(5), updated_at: daysAgo(5) },
  { id: 't4', client_id: 'c2', engagement_id: 'e3', task_type: 'internal_audit', title: 'Internal Audit Q4 2024-25', assigned_to: 'u2', status: 'under_review', priority: 'medium', due_date: daysFromNow(5), start_date: daysAgo(20), financial_year: '2024-25', created_at: daysAgo(25), updated_at: daysAgo(1) },
  { id: 't5', client_id: 'c3', engagement_id: 'e4', task_type: 'itr_filing', title: 'ITR Filing AY 2025-26', assigned_to: 'u4', status: 'not_started', priority: 'medium', due_date: daysFromNow(120), financial_year: '2024-25', assessment_year: '2025-26', created_at: daysAgo(10), updated_at: daysAgo(10) },
  { id: 't6', client_id: 'c4', task_type: 'gst_return', title: 'GST 3B - Feb 2025', assigned_to: 'u5', status: 'completed', priority: 'high', due_date: daysAgo(5), completed_date: daysAgo(7), financial_year: '2024-25', created_at: daysAgo(20), updated_at: daysAgo(7) },
  { id: 't7', client_id: 'c4', task_type: 'bookkeeping', title: 'Bookkeeping - March 2025', assigned_to: 'u5', status: 'in_progress', priority: 'low', due_date: daysFromNow(10), start_date: daysAgo(3), financial_year: '2024-25', created_at: daysAgo(5), updated_at: daysAgo(1) },
  { id: 't8', client_id: 'c5', engagement_id: 'e5', task_type: 'roc_compliance', title: 'Annual ROC Filing FY 2024-25', assigned_to: 'u2', status: 'on_hold', priority: 'urgent', due_date: daysAgo(3), financial_year: '2024-25', created_at: daysAgo(30), updated_at: daysAgo(2) },
  { id: 't9', client_id: 'c5', task_type: 'tds_return', title: 'TDS Return Q4 FY 2024-25', assigned_to: 'u3', status: 'in_progress', priority: 'high', due_date: daysFromNow(1), start_date: daysAgo(5), financial_year: '2024-25', created_at: daysAgo(10), updated_at: daysAgo(1) },
  { id: 't10', client_id: 'c2', task_type: 'gst_return', title: 'GST 3B - Mar 2025', assigned_to: 'u5', status: 'not_started', priority: 'high', due_date: daysAgo(1), financial_year: '2024-25', created_at: daysAgo(10), updated_at: daysAgo(10) },
  { id: 't11', client_id: 'c6', engagement_id: 'e7', task_type: 'gst_audit', title: 'GST Reconciliation - Kumar LLP', assigned_to: 'u3', status: 'in_progress', priority: 'medium', due_date: daysFromNow(25), start_date: daysAgo(8), financial_year: '2024-25', created_at: daysAgo(10), updated_at: daysAgo(3) },
  { id: 't12', client_id: 'c7', engagement_id: 'e8', task_type: 'bookkeeping', title: 'Monthly Books - Sree Textiles', assigned_to: 'u5', status: 'in_progress', priority: 'low', due_date: daysFromNow(8), start_date: daysAgo(5), financial_year: '2024-25', created_at: daysAgo(5), updated_at: daysAgo(1) },
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

export let mockMembers: ClientMember[] = [
  { id: 'm1', client_id: 'c1', name: 'Dr. Nithya Krishnan', role: 'Director', email: 'nithya@kmch.in', phone: '9876500001', pan: 'AEXPN1234K', din: '01234567', created_at: '2024-01-15T00:00:00Z' },
  { id: 'm2', client_id: 'c1', name: 'Mr. Ravi Kumar', role: 'Accountant', email: 'ravi@kmch.in', phone: '9876500010', created_at: '2024-01-15T00:00:00Z' },
  { id: 'm3', client_id: 'c2', name: 'Mr. Suresh Babu', role: 'Director', phone: '9876500002', pan: 'BKRPS5678L', din: '07654321', created_at: '2024-03-01T00:00:00Z' },
  { id: 'm4', client_id: 'c4', name: 'Mr. Anand', role: 'Partner', phone: '9876500004', pan: 'AACPA9876C', created_at: '2024-01-20T00:00:00Z' },
  { id: 'm5', client_id: 'c4', name: 'Mrs. Lakshmi', role: 'Partner', phone: '9876500011', pan: 'BKLPL4567D', created_at: '2024-01-20T00:00:00Z' },
  { id: 'm6', client_id: 'c5', name: 'Ms. Priya Sharma', role: 'Director', email: 'priya@xyz.co.in', phone: '9876500005', pan: 'AABCX4321E', din: '03456789', created_at: '2024-04-01T00:00:00Z' },
  { id: 'm7', client_id: 'c5', name: 'Mr. Vikram Reddy', role: 'Key Managerial Person', email: 'vikram@xyz.co.in', phone: '9876500012', created_at: '2024-04-01T00:00:00Z' },
  { id: 'm8', client_id: 'c6', name: 'Mr. Kumar', role: 'Partner', email: 'kumar@kumarlegal.in', phone: '9876500006', pan: 'AAFFL5678E', created_at: '2024-05-01T00:00:00Z' },
  { id: 'm9', client_id: 'c7', name: 'Mr. Sreenivasan', role: 'Proprietor', phone: '9876500007', pan: 'BKRPS9876F', created_at: '2024-06-01T00:00:00Z' },
];

// Indian Compliance Calendar - Pre-loaded deadlines
export const complianceDeadlines: ComplianceDeadline[] = [
  // GST
  { id: 'cd1', type: 'GST 3B', title: 'GST 3B Return', description: 'Monthly GST return filing', due_date: '2025-04-20', frequency: 'monthly', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
  { id: 'cd2', type: 'GST 3B', title: 'GST 3B Return', description: 'Monthly GST return filing', due_date: '2025-05-20', frequency: 'monthly', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
  { id: 'cd3', type: 'GST 3B', title: 'GST 3B Return', description: 'Monthly GST return filing', due_date: '2025-06-20', frequency: 'monthly', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
  { id: 'cd4', type: 'GSTR-1', title: 'GSTR-1 Return', description: 'Outward supply return', due_date: '2025-04-11', frequency: 'monthly', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
  { id: 'cd5', type: 'GSTR-1', title: 'GSTR-1 Return', description: 'Outward supply return', due_date: '2025-05-11', frequency: 'monthly', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
  // TDS
  { id: 'cd6', type: 'TDS Return', title: 'TDS Return Q4', description: 'Quarterly TDS return (Form 24Q/26Q)', due_date: '2025-05-31', frequency: 'quarterly', applicable_to: ['company', 'llp', 'partnership', 'hospital'] },
  { id: 'cd7', type: 'TDS Return', title: 'TDS Return Q1', description: 'Quarterly TDS return (Form 24Q/26Q)', due_date: '2025-07-31', frequency: 'quarterly', applicable_to: ['company', 'llp', 'partnership', 'hospital'] },
  // ITR
  { id: 'cd8', type: 'ITR', title: 'ITR Filing (Non-audit)', description: 'Income Tax Return for non-audit cases', due_date: '2025-07-31', frequency: 'annual', applicable_to: ['individual', 'proprietorship'] },
  { id: 'cd9', type: 'ITR', title: 'ITR Filing (Audit cases)', description: 'Income Tax Return for audit cases', due_date: '2025-10-31', frequency: 'annual', applicable_to: ['company', 'llp', 'partnership', 'hospital'] },
  { id: 'cd10', type: 'Tax Audit', title: 'Tax Audit Report (44AB)', description: 'Tax Audit Report u/s 44AB', due_date: '2025-09-30', frequency: 'annual', applicable_to: ['company', 'llp', 'partnership', 'hospital', 'proprietorship'] },
  // ROC
  { id: 'cd11', type: 'ROC', title: 'AOC-4 Filing', description: 'Annual financial statements', due_date: '2025-10-30', frequency: 'annual', applicable_to: ['company'] },
  { id: 'cd12', type: 'ROC', title: 'MGT-7 Filing', description: 'Annual return of company', due_date: '2025-11-29', frequency: 'annual', applicable_to: ['company'] },
  { id: 'cd13', type: 'ROC', title: 'LLP Form 11', description: 'Annual return of LLP', due_date: '2025-05-30', frequency: 'annual', applicable_to: ['llp'] },
  { id: 'cd14', type: 'ROC', title: 'LLP Form 8', description: 'Statement of accounts', due_date: '2025-10-30', frequency: 'annual', applicable_to: ['llp'] },
  // MCA
  { id: 'cd15', type: 'MCA', title: 'DIR-3 KYC', description: 'Director KYC filing', due_date: '2025-09-30', frequency: 'annual', applicable_to: ['company', 'llp'] },
  // GST Annual
  { id: 'cd16', type: 'GSTR-9', title: 'GSTR-9 Annual Return', description: 'GST Annual Return', due_date: '2025-12-31', frequency: 'annual', applicable_to: ['company', 'llp', 'partnership', 'proprietorship', 'hospital'] },
];

export let mockInvoices: Invoice[] = [
  { id: 'inv1', client_id: 'c1', engagement_id: 'e1', invoice_number: 'AF/2024-25/001', date: daysAgo(30), due_date: daysAgo(0), amount: 250000, gst_amount: 45000, total_amount: 295000, status: 'sent', description: 'Statutory Audit FY 2024-25', created_at: daysAgo(30) },
  { id: 'inv2', client_id: 'c1', engagement_id: 'e2', invoice_number: 'AF/2024-25/002', date: daysAgo(90), due_date: daysAgo(60), amount: 60000, gst_amount: 10800, total_amount: 70800, status: 'paid', description: 'GST Returns FY 2024-25', paid_date: daysAgo(55), paid_amount: 70800, created_at: daysAgo(90) },
  { id: 'inv3', client_id: 'c2', engagement_id: 'e3', invoice_number: 'AF/2024-25/003', date: daysAgo(20), due_date: daysFromNow(10), amount: 100000, gst_amount: 18000, total_amount: 118000, status: 'sent', description: 'Internal Audit Q4 2024-25', created_at: daysAgo(20) },
  { id: 'inv4', client_id: 'c3', engagement_id: 'e4', invoice_number: 'AF/2024-25/004', date: daysAgo(10), due_date: daysFromNow(20), amount: 5000, gst_amount: 900, total_amount: 5900, status: 'draft', description: 'ITR Filing AY 2025-26', created_at: daysAgo(10) },
  { id: 'inv5', client_id: 'c5', engagement_id: 'e5', invoice_number: 'AF/2024-25/005', date: daysAgo(60), due_date: daysAgo(30), amount: 35000, gst_amount: 6300, total_amount: 41300, status: 'overdue', description: 'ROC Filing FY 2024-25', created_at: daysAgo(60) },
  { id: 'inv6', client_id: 'c4', engagement_id: 'e6', invoice_number: 'AF/2024-25/006', date: daysAgo(5), due_date: daysFromNow(25), amount: 40000, gst_amount: 7200, total_amount: 47200, status: 'sent', description: 'Tax Audit FY 2024-25', created_at: daysAgo(5) },
  { id: 'inv7', client_id: 'c6', engagement_id: 'e7', invoice_number: 'AF/2024-25/007', date: daysAgo(15), due_date: daysFromNow(15), amount: 50000, gst_amount: 9000, total_amount: 59000, status: 'sent', description: 'GST Audit FY 2024-25', created_at: daysAgo(15) },
  { id: 'inv8', client_id: 'c7', engagement_id: 'e8', invoice_number: 'AF/2024-25/008', date: daysAgo(60), due_date: daysAgo(30), amount: 24000, gst_amount: 4320, total_amount: 28320, status: 'paid', description: 'Bookkeeping FY 2024-25', paid_date: daysAgo(28), paid_amount: 28320, created_at: daysAgo(60) },
];

export let mockDocuments: Document[] = [
  { id: 'd1', client_id: 'c1', engagement_id: 'e1', name: 'Trial Balance FY 2024-25', category: 'Financial Statements', financial_year: '2024-25', uploaded_by: 'u9', upload_date: daysAgo(20), status: 'verified', version: 2, notes: 'Revised version after adjustments' },
  { id: 'd2', client_id: 'c1', engagement_id: 'e1', name: 'Bank Statements - All Accounts', category: 'Bank Records', financial_year: '2024-25', uploaded_by: 'u9', upload_date: daysAgo(18), status: 'received', version: 1 },
  { id: 'd3', client_id: 'c1', engagement_id: 'e1', name: 'Fixed Assets Register', category: 'Assets', financial_year: '2024-25', uploaded_by: 'u7', upload_date: daysAgo(15), status: 'pending', version: 1 },
  { id: 'd4', client_id: 'c1', engagement_id: 'e2', name: 'Sales Register - Feb 2025', category: 'GST Records', financial_year: '2024-25', uploaded_by: 'u9', upload_date: daysAgo(10), status: 'verified', version: 1 },
  { id: 'd5', client_id: 'c2', engagement_id: 'e3', name: 'Internal Audit Report Draft', category: 'Reports', financial_year: '2024-25', uploaded_by: 'u2', upload_date: daysAgo(3), status: 'received', version: 1 },
  { id: 'd6', client_id: 'c3', name: 'Form 16 AY 2025-26', category: 'Tax Documents', financial_year: '2024-25', uploaded_by: 'u8', upload_date: daysAgo(5), status: 'received', version: 1 },
  { id: 'd7', client_id: 'c5', engagement_id: 'e5', name: 'Board Resolution', category: 'Corporate Records', financial_year: '2024-25', uploaded_by: 'u5', upload_date: daysAgo(8), status: 'rejected', version: 1, notes: 'Needs proper stamp and signature' },
  { id: 'd8', client_id: 'c4', name: 'Partnership Deed', category: 'Legal Documents', financial_year: '2024-25', uploaded_by: 'u4', upload_date: daysAgo(30), status: 'verified', version: 1 },
  { id: 'd9', client_id: 'c6', engagement_id: 'e7', name: 'GSTR-2A Reconciliation', category: 'GST Records', financial_year: '2024-25', uploaded_by: 'u3', upload_date: daysAgo(7), status: 'received', version: 1 },
];
