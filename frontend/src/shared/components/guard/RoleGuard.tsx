import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import type { UserRole } from '@/shared/api/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallbackPath = '/',
}) => {
  const { user, activeOrganization } = useAuth();

  // If user has platform admin globally, allow access
  const isPlatformAdmin = user?.roles.includes('ROLE_PLATFORM_ADMIN');
  if (isPlatformAdmin) {
    return <>{children}</>;
  }

  // Check active organization role or user's global roles
  const currentRole = activeOrganization?.role;
  const hasAccess =
    (currentRole && allowedRoles.includes(currentRole)) ||
    user?.roles.some((r) => allowedRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
