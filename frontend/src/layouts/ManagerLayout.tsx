import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  FolderKanban,
  CheckSquare,
  FileCheck2,
  AlertCircle,
  Users2,
  CalendarClock,
} from 'lucide-react';

const managerNavItems: NavItem[] = [
  { label: 'Project Dashboard', to: '/manager/dashboard', icon: FolderKanban },
  { label: 'Active Projects', to: '/manager/projects', icon: FolderKanban },
  { label: 'Task Management', to: '/manager/tasks', icon: CheckSquare },
  { label: 'Review Work Reports', to: '/manager/work-reports', icon: FileCheck2 },
  { label: 'Work Requests & Blockers', to: '/manager/requests', icon: AlertCircle },
  { label: 'Team Allocation', to: '/manager/team', icon: Users2 },
  { label: 'Milestones & Deadlines', to: '/manager/schedules', icon: CalendarClock },
];

export const ManagerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="Project Manager Portal" />
      <div className="flex flex-1">
        <Sidebar title="Manager Navigation" items={managerNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
