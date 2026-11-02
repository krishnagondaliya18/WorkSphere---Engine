import React from 'react';
import { Server, Activity, Database, ShieldAlert, Cpu } from 'lucide-react';

export const PlatformAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Super-Admin</h1>
          <p className="text-sm text-slate-500">Global system health & tenant coordination</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>All 8 Microservices Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tenants</span>
            <ShieldAlert className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">142</div>
          <p className="text-xs text-slate-500 mt-1">Active enterprise workspaces</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">API Gateway TPS</span>
            <Server className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">4,280/s</div>
          <p className="text-xs text-slate-500 mt-1">Avg latency: 12ms</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Kafka KRaft Lag</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">0 msgs</div>
          <p className="text-xs text-slate-500 mt-1">Real-time outbox streaming</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Logical Databases</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">8 / 8</div>
          <p className="text-xs text-slate-500 mt-1">PostgreSQL 16 instances</p>
        </div>
      </div>
    </div>
  );
};
