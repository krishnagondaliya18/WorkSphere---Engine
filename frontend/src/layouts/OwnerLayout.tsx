import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  LayoutDashboard,
  Building,
  Users,
  Briefcase,
  FolderGit2,
  BarChart3,
  ShieldAlert,
  Settings,
} from 'lucide-react';

const ownerNavItems: NavItem[] = [
  { label: 'Executive Overview', to: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'Company Profile', to: '/owner/organization', icon: Building },
  { label: 'Departments & Teams', to: '/owner/departments', icon: Users },
  { label: 'Workforce Members', to: '/owner/members', icon: Briefcase },
  { label: 'Company Projects', to: '/owner/projects', icon: FolderGit2 },
  { label: 'Analytics & KPIs', to: '/owner/analytics', icon: BarChart3 },
  { label: 'Audit Trail', to: '/owner/audit-logs', icon: ShieldAlert },
  { label: 'Workspace Settings', to: '/owner/settings', icon: Settings },
];

export const OwnerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="Company Owner Portal" />
      <div className="flex flex-1">
        <Sidebar title="Owner Navigation" items={ownerNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
