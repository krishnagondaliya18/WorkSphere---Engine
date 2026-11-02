import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CandidatePortalPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Candidate Application Portal
          </h1>
          <p className="text-sm text-slate-500">Welcome, {user?.firstName || 'Applicant'}</p>
        </div>
        <Link
          to="/careers"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse Open Positions</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Submitted Applications</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2</div>
          <p className="text-xs text-slate-500 mt-1">Under technical review</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Interviews</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">1</div>
          <p className="text-xs text-teal-600 font-medium mt-1">Technical round tomorrow</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Profile Verification</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">Complete</div>
          <p className="text-xs text-slate-500 mt-1">Resume uploaded & parsed</p>
        </div>
      </div>
    </div>
  );
};
