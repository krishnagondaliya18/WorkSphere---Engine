-- WorkSphere Engine: Initialize Logical Databases per Microservice
SELECT 'Creating microservice databases...' AS status;

CREATE DATABASE auth_db;
CREATE DATABASE organization_db;
CREATE DATABASE employee_db;
CREATE DATABASE project_task_db;
CREATE DATABASE work_management_db;
CREATE DATABASE notification_db;
CREATE DATABASE recruitment_db;
CREATE DATABASE analytics_audit_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE organization_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE employee_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE project_task_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE work_management_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE analytics_audit_db TO postgres;
