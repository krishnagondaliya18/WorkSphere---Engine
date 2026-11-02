import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { OwnerLayout } from '@/layouts/OwnerLayout';
import { HRLayout } from '@/layouts/HRLayout';
import { ManagerLayout } from '@/layouts/ManagerLayout';
import { EmployeeLayout } from '@/layouts/EmployeeLayout';
import { CandidateLayout } from '@/layouts/CandidateLayout';
import { PlatformAdminLayout } from '@/layouts/PlatformAdminLayout';

// Guards
import { ProtectedRoute } from '@/shared/components/guard/ProtectedRoute';
import { RoleGuard } from '@/shared/components/guard/RoleGuard';

// Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { SelectOrganizationPage } from '@/pages/auth/SelectOrganizationPage';

import { OwnerDashboardPage } from '@/pages/owner/OwnerDashboardPage';
import { HRDashboardPage } from '@/pages/hr/HRDashboardPage';
import { ManagerDashboardPage } from '@/pages/manager/ManagerDashboardPage';
import { EmployeeDashboardPage } from '@/pages/employee/EmployeeDashboardPage';
import { CandidatePortalPage } from '@/pages/candidate/CandidatePortalPage';
import { PlatformAdminDashboardPage } from '@/pages/admin/PlatformAdminDashboardPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'careers', element: <LandingPage /> }, // career portal preview
      { path: '404', element: <NotFoundPage /> },
    ],
  },

  // Auth Routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'select-organization',
        element: (
          <ProtectedRoute>
            <SelectOrganizationPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Company Owner Routes
  {
    path: '/owner',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_COMPANY_OWNER', 'ROLE_PLATFORM_ADMIN']}>
          <OwnerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/owner/dashboard" replace /> },
      { path: 'dashboard', element: <OwnerDashboardPage /> },
      { path: 'organization', element: <OwnerDashboardPage /> },
      { path: 'departments', element: <OwnerDashboardPage /> },
      { path: 'members', element: <OwnerDashboardPage /> },
      { path: 'projects', element: <OwnerDashboardPage /> },
      { path: 'analytics', element: <OwnerDashboardPage /> },
      { path: 'audit-logs', element: <OwnerDashboardPage /> },
      { path: 'settings', element: <OwnerDashboardPage /> },
    ],
  },

  // HR Manager Routes
  {
    path: '/hr',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_HR_MANAGER', 'ROLE_COMPANY_OWNER', 'ROLE_PLATFORM_ADMIN']}>
          <HRLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/hr/dashboard" replace /> },
      { path: 'dashboard', element: <HRDashboardPage /> },
      { path: 'employees', element: <HRDashboardPage /> },
      { path: 'departments', element: <HRDashboardPage /> },
      { path: 'designations', element: <HRDashboardPage /> },
      { path: 'recruitment/jobs', element: <HRDashboardPage /> },
      { path: 'recruitment/candidates', element: <HRDashboardPage /> },
      { path: 'attendance', element: <HRDashboardPage /> },
      { path: 'settings', element: <HRDashboardPage /> },
    ],
  },

  // Project Manager Routes
  {
    path: '/manager',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_PROJECT_MANAGER', 'ROLE_COMPANY_OWNER', 'ROLE_PLATFORM_ADMIN']}>
          <ManagerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: 'dashboard', element: <ManagerDashboardPage /> },
      { path: 'projects', element: <ManagerDashboardPage /> },
      { path: 'tasks', element: <ManagerDashboardPage /> },
      { path: 'work-reports', element: <ManagerDashboardPage /> },
      { path: 'requests', element: <ManagerDashboardPage /> },
      { path: 'team', element: <ManagerDashboardPage /> },
      { path: 'schedules', element: <ManagerDashboardPage /> },
    ],
  },

  // Employee Workspace Routes
  {
    path: '/employee',
    element: (
      <ProtectedRoute>
        <RoleGuard
          allowedRoles={[
            'ROLE_EMPLOYEE',
            'ROLE_PROJECT_MANAGER',
            'ROLE_HR_MANAGER',
            'ROLE_COMPANY_OWNER',
            'ROLE_PLATFORM_ADMIN',
          ]}
        >
          <EmployeeLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/employee/dashboard" replace /> },
      { path: 'dashboard', element: <EmployeeDashboardPage /> },
      { path: 'tasks', element: <EmployeeDashboardPage /> },
      { path: 'submit-report', element: <EmployeeDashboardPage /> },
      { path: 'reports', element: <EmployeeDashboardPage /> },
      { path: 'requests', element: <EmployeeDashboardPage /> },
      { path: 'profile', element: <EmployeeDashboardPage /> },
      { path: 'notifications', element: <EmployeeDashboardPage /> },
    ],
  },

  // Candidate Portal Routes
  {
    path: '/candidate',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_CANDIDATE', 'ROLE_PLATFORM_ADMIN']}>
          <CandidateLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/candidate/applications" replace /> },
      { path: 'applications', element: <CandidatePortalPage /> },
      { path: 'interviews', element: <CandidatePortalPage /> },
      { path: 'profile', element: <CandidatePortalPage /> },
    ],
  },

  // Platform Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_PLATFORM_ADMIN']}>
          <PlatformAdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <PlatformAdminDashboardPage /> },
      { path: 'organizations', element: <PlatformAdminDashboardPage /> },
      { path: 'services', element: <PlatformAdminDashboardPage /> },
      { path: 'kafka', element: <PlatformAdminDashboardPage /> },
      { path: 'databases', element: <PlatformAdminDashboardPage /> },
      { path: 'audit', element: <PlatformAdminDashboardPage /> },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
