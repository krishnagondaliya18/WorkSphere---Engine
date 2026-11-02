export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errorCode: string | null;
  timestamp: string;
  correlationId: string | null;
}

export type UserRole =
  | 'ROLE_PLATFORM_ADMIN'
  | 'ROLE_COMPANY_OWNER'
  | 'ROLE_HR_MANAGER'
  | 'ROLE_PROJECT_MANAGER'
  | 'ROLE_EMPLOYEE'
  | 'ROLE_CANDIDATE';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  activeOrganizationId?: string;
  roles: UserRole[];
}

export interface OrganizationMembership {
  organizationId: string;
  organizationName: string;
  slug: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  user: UserProfile | null;
  memberships: OrganizationMembership[];
  activeOrganization: OrganizationMembership | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
