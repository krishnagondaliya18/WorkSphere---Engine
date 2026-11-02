import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-teal-500/20">
            W
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">WorkSphere</span>
        </Link>
        <div className="mt-2 flex items-center justify-center space-x-1.5 text-xs text-teal-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Multi-Tenant Enterprise Isolation</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          <Outlet />
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          WorkSphere SaaS Engine &bull; Spring Cloud API Gateway &bull; Dual-Identity Security
        </div>
      </div>
    </div>
  );
};
