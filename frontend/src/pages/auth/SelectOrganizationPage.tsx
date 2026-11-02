import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Building2, ArrowRight } from 'lucide-react';

export const SelectOrganizationPage: React.FC = () => {
  const { memberships, switchOrganization } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (orgId: string, role: string) => {
    switchOrganization(orgId);
    if (role === 'ROLE_COMPANY_OWNER') navigate('/owner/dashboard');
    else if (role === 'ROLE_HR_MANAGER') navigate('/hr/dashboard');
    else if (role === 'ROLE_PROJECT_MANAGER') navigate('/manager/dashboard');
    else navigate('/employee/dashboard');
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Select Organization Workspace</h2>
        <p className="text-xs text-slate-500 mt-1">Choose the tenant context you wish to access</p>
      </div>

      <div className="space-y-3">
        {memberships.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-500">
            No active memberships found. Contact your workspace administrator or register a new company.
          </div>
        ) : (
          memberships.map((org) => (
            <button
              key={org.organizationId}
              onClick={() => handleSelect(org.organizationId, org.role)}
              className="w-full p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                    {org.organizationName}
                  </h4>
                  <p className="text-xs text-slate-500">Role: {org.role.replace('ROLE_', '')}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
