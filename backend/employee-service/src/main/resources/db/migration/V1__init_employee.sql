-- WorkSphere Engine: Employee Service Schema
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    head_employee_id UUID,
    UNIQUE (organization_id, name)
);

CREATE TABLE IF NOT EXISTS designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    UNIQUE (organization_id, title)
);

CREATE TABLE IF NOT EXISTS employee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    reports_to_id UUID REFERENCES employee_profiles(id),
    employment_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joining_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, employee_code),
    UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_employee_org_dept ON employee_profiles(organization_id, department_id);
CREATE INDEX IF NOT EXISTS idx_employee_org_user ON employee_profiles(organization_id, user_id);
