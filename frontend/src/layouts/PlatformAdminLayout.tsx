import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { Sidebar, type NavItem } from '@/shared/components/layout/Sidebar';
import {
  ShieldAlert,
  Server,
  Layers,
  Database,
  Activity,
  KeyRound,
} from 'lucide-react';

const platformAdminNavItems: NavItem[] = [
  { label: 'Platform Overview', to: '/admin/dashboard', icon: ShieldAlert },
  { label: 'Tenant Organizations', to: '/admin/organizations', icon: Layers },
  { label: 'Microservice Topology', to: '/admin/services', icon: Server },
  { label: 'Kafka Event Mesh', to: '/admin/kafka', icon: Activity },
  { label: 'Database Shards & Health', to: '/admin/databases', icon: Database },
  { label: 'Global Audit Trail', to: '/admin/audit', icon: KeyRound },
];

export const PlatformAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar portalTitle="Platform Super-Admin" />
      <div className="flex flex-1">
        <Sidebar title="Platform Administration" items={platformAdminNavItems} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
