import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Server,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>WorkSphere Engine 1.0 Enterprise Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            The Multi-Tenant Workforce & Company Operations Platform
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Cryptographically isolated company workspaces, distributed Spring Boot 3 microservices, Kafka KRaft event mesh, and role-driven workforce operations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-base transition-colors"
            >
              Sign In to Organization
            </Link>
          </div>
        </div>
      </section>

      {/* Architectural Highlights */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-wider font-bold text-teal-600">Enterprise Foundation</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Built for Scale, Reliability, and Zero-Trust Multi-Tenancy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cryptographic Tenant Isolation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dual-identity model separating global user credentials from organization-scoped memberships. API Gateway automatically validates and sanitizes all tenant propagation headers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database-Per-Service Autonomy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                8 autonomous Spring Boot 3 microservices each owning independent PostgreSQL database schemas. Zero cross-service database joins or shared entities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Kafka KRaft Event Backbone</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transactional Outbox pattern ensuring zero-loss event streaming across notifications, task assignments, and audit logging with dead-letter topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Workspaces Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-wider font-bold text-teal-600">Unified Experience</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Tailored Portals for Every Stakeholder
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <Building className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">Company Owner</h4>
              <p className="text-xs text-slate-600">
                Workspace configuration, subscription tier, team hierarchy, high-level project KPIs, and audit trails.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <Users className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">HR Manager</h4>
              <p className="text-xs text-slate-600">
                Employee onboarding, department directories, recruitment pipelines, and candidate applicant tracking.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <Layers className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">Project Manager</h4>
              <p className="text-xs text-slate-600">
                Sprint planning, task boards, daily work report approvals, deadline extension requests, and blockers.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <CheckCircle className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-1">Employee</h4>
              <p className="text-xs text-slate-600">
                Personal task queue, daily submission reports, blocker escalations, and real-time in-app notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
