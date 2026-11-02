import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Public Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow">
              W
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">WorkSphere</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/careers" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
              Careers Portal
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-slate-200 text-sm">WorkSphere Engine</span>
            <span className="text-xs text-slate-500">| Enterprise Multi-Tenant Workforce SaaS</span>
          </div>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} WorkSphere Inc. All rights reserved. Built with React 19 & Spring Cloud.
          </div>
        </div>
      </footer>
    </div>
  );
};
