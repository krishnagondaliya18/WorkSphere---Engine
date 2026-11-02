-- WorkSphere Engine: Work Management Service Schema
CREATE TABLE IF NOT EXISTS work_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    report_date DATE NOT NULL,
    report_type VARCHAR(50) NOT NULL DEFAULT 'DAILY',
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    blockers_summary TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_report_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_report_id UUID NOT NULL REFERENCES work_reports(id) ON DELETE CASCADE,
    reviewer_employee_id UUID NOT NULL,
    review_decision VARCHAR(50) NOT NULL,
    reviewer_comments TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    target_task_id UUID,
    request_type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_org_emp ON work_reports(organization_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_requests_org_status ON work_requests(organization_id, status);
