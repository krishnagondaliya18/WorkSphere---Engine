import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { CheckCircle2, FileText, Send, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboardPage: React.FC = () => {
  const { user, activeOrganization } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.firstName || 'Colleague'}
          </h1>
          <p className="text-sm text-slate-500">
            Workforce Portal &bull; {activeOrganization?.organizationName}
          </p>
        </div>
        <Link
          to="/employee/submit-report"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Submit Today&apos;s Work Report</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">5</div>
          <p className="text-xs text-slate-500 mt-1">2 due this week</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Report Status</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">Pending</div>
          <p className="text-xs text-slate-500 mt-1">Due before end-of-day</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Requests</span>
            <Send className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">1</div>
          <p className="text-xs text-slate-500 mt-1">Extension requested</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Sprint</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Sprint 42</div>
          <p className="text-xs text-slate-500 mt-1">Ends in 3 days</p>
        </div>
      </div>
    </div>
  );
};
