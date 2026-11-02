import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  FileText,
  Calendar,
  Briefcase,
  UserCheck,
} from 'lucide-react';

const candidateNavItems: NavItem[] = [
  { label: 'My Applications', to: '/candidate/applications', icon: FileText },
  { label: 'Interview Schedule', to: '/candidate/interviews', icon: Calendar },
  { label: 'Explore Job Openings', to: '/careers', icon: Briefcase },
  { label: 'Candidate Profile & CV', to: '/candidate/profile', icon: UserCheck },
];

export const CandidateLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="Candidate Portal" />
      <div className="flex flex-1">
        <Sidebar title="Applicant Portal" items={candidateNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
