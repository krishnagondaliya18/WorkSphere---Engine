import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Building2, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  portalTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ portalTitle }) => {
  const { user, memberships, activeOrganization, switchOrganization, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            W
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">WorkSphere</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          {portalTitle}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Organization / Tenant Switcher */}
        {memberships && memberships.length > 0 && (
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="max-w-[140px] truncate">
                {activeOrganization ? activeOrganization.organizationName : 'Select Company'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg hidden group-hover:block z-50 py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
                Switch Organization
              </div>
              {memberships.map((m) => (
                <button
                  key={m.organizationId}
                  onClick={() => switchOrganization(m.organizationId)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    activeOrganization?.organizationId === m.organizationId
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{m.organizationName}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{m.role.replace('ROLE_', '')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Icon */}
        <button
          type="button"
          aria-label="View notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full" />
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {user?.firstName ? user.firstName[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight text-slate-800">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
