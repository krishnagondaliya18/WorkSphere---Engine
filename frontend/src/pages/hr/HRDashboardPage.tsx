import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Users, UserPlus, Briefcase, Calendar } from 'lucide-react';

export const HRDashboardPage: React.FC = () => {
  const { activeOrganization } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Operations Dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage workforce directory, recruitments, and departments in {activeOrganization?.organizationName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Employees</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">48</div>
          <p className="text-xs text-slate-500 mt-1">Full-time & contractors</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Positions</span>
            <UserPlus className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">6</div>
          <p className="text-xs text-slate-500 mt-1">Across Engineering & Product</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Candidates In Review</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">23</div>
          <p className="text-xs text-slate-500 mt-1">4 interviews scheduled this week</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">On Leave Today</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2</div>
          <p className="text-xs text-slate-500 mt-1">Planned leaves</p>
        </div>
      </div>
    </div>
  );
};
