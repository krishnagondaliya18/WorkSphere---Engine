import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState, UserProfile, OrganizationMembership } from '@/shared/api/types';

interface AuthContextType extends AuthState {
  login: (token: string, user: UserProfile, memberships: OrganizationMembership[]) => void;
  logout: () => void;
  switchOrganization: (orgId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    memberships: [],
    activeOrganization: null,
    accessToken: localStorage.getItem('worksphere_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from local storage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('worksphere_token');
      const savedUser = localStorage.getItem('worksphere_user');
      const savedMemberships = localStorage.getItem('worksphere_memberships');
      const savedActiveOrgId = localStorage.getItem('worksphere_active_org_id');

      if (token && savedUser) {
        const user: UserProfile = JSON.parse(savedUser);
        const memberships: OrganizationMembership[] = savedMemberships ? JSON.parse(savedMemberships) : [];
        const activeOrg = memberships.find((m) => m.organizationId === savedActiveOrgId) || memberships[0] || null;

        setState({
          user,
          memberships,
          activeOrganization: activeOrg,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      localStorage.removeItem('worksphere_token');
      localStorage.removeItem('worksphere_user');
      localStorage.removeItem('worksphere_memberships');
      localStorage.removeItem('worksphere_active_org_id');
    }

    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const login = useCallback((token: string, user: UserProfile, memberships: OrganizationMembership[]) => {
    localStorage.setItem('worksphere_token', token);
    localStorage.setItem('worksphere_user', JSON.stringify(user));
    localStorage.setItem('worksphere_memberships', JSON.stringify(memberships));

    const defaultOrg = memberships[0] || null;
    if (defaultOrg) {
      localStorage.setItem('worksphere_active_org_id', defaultOrg.organizationId);
    }

    setState({
      user,
      memberships,
      activeOrganization: defaultOrg,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('worksphere_token');
    localStorage.removeItem('worksphere_user');
    localStorage.removeItem('worksphere_memberships');
    localStorage.removeItem('worksphere_active_org_id');

    setState({
      user: null,
      memberships: [],
      activeOrganization: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const switchOrganization = useCallback((orgId: string) => {
    setState((prev) => {
      const targetOrg = prev.memberships.find((m) => m.organizationId === orgId) || null;
      if (targetOrg) {
        localStorage.setItem('worksphere_active_org_id', targetOrg.organizationId);
      }
      return {
        ...prev,
        activeOrganization: targetOrg,
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
