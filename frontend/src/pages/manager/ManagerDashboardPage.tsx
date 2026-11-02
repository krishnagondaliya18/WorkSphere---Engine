import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { FolderKanban, CheckSquare, Clock, AlertTriangle } from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  const { activeOrganization } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Manager Dashboard</h1>
        <p className="text-sm text-slate-500">
          Track project sprints, daily work reports, and team blockers in {activeOrganization?.organizationName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Projects</span>
            <FolderKanban className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">4</div>
          <p className="text-xs text-slate-500 mt-1">Active sprint cycle</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reports</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">7</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Requires your review today</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks In Progress</span>
            <CheckSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">19</div>
          <p className="text-xs text-slate-500 mt-1">Across 14 team members</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Blockers</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">2</div>
          <p className="text-xs text-rose-600 font-medium mt-1">Requires immediate unblocking</p>
        </div>
      </div>
    </div>
  );
};
