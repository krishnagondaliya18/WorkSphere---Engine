import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Users, FolderGit2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const { activeOrganization } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of {activeOrganization?.organizationName || 'your company workspace'}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Tenant ID: {activeOrganization?.organizationId?.slice(0, 8)}...</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Workforce</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">48</div>
          <p className="text-xs text-slate-500 mt-1">Across 4 departments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">12</div>
          <p className="text-xs text-slate-500 mt-1">3 nearing milestone delivery</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Task Completion</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">92.4%</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">&uarr; 3.2% vs last sprint</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Work Reports</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">38 / 48</div>
          <p className="text-xs text-slate-500 mt-1">Submitted today</p>
        </div>
      </div>

      {/* Domain Services Status Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Enterprise Services Connected</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Auth Service</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8081 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Organization</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8082 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Employee Directory</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8083 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Project & Tasks</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8084 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Work Management</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8085 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Notifications</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8086 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Recruitment</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8087 OK</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Analytics & Audit</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">8088 OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
