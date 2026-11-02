import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  Users,
  Building2,
  BadgeCheck,
  UserPlus,
  FileSpreadsheet,
  CalendarDays,
  Settings2,
} from 'lucide-react';

const hrNavItems: NavItem[] = [
  { label: 'HR Dashboard', to: '/hr/dashboard', icon: Users },
  { label: 'Employee Directory', to: '/hr/employees', icon: Users },
  { label: 'Departments', to: '/hr/departments', icon: Building2 },
  { label: 'Designations', to: '/hr/designations', icon: BadgeCheck },
  { label: 'Job Postings', to: '/hr/recruitment/jobs', icon: UserPlus },
  { label: 'Candidate Pipeline', to: '/hr/recruitment/candidates', icon: FileSpreadsheet },
  { label: 'Attendance & Leaves', to: '/hr/attendance', icon: CalendarDays },
  { label: 'HR Configuration', to: '/hr/settings', icon: Settings2 },
];

export const HRLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="HR Management Portal" />
      <div className="flex flex-1">
        <Sidebar title="HR Navigation" items={hrNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
