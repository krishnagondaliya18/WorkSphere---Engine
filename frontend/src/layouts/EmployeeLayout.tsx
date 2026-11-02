import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  Home,
  CheckCircle2,
  FileText,
  Send,
  UserCircle,
  BellRing,
} from 'lucide-react';

const employeeNavItems: NavItem[] = [
  { label: 'My Workspace', to: '/employee/dashboard', icon: Home },
  { label: 'Assigned Tasks', to: '/employee/tasks', icon: CheckCircle2 },
  { label: 'Submit Daily Report', to: '/employee/submit-report', icon: FileText },
  { label: 'Report History', to: '/employee/reports', icon: FileText },
  { label: 'Work Requests & Blockers', to: '/employee/requests', icon: Send },
  { label: 'My Profile & Details', to: '/employee/profile', icon: UserCircle },
  { label: 'Notification Center', to: '/employee/notifications', icon: BellRing },
];

export const EmployeeLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="Employee Workspace" />
      <div className="flex flex-1">
        <Sidebar title="Employee Portal" items={employeeNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
