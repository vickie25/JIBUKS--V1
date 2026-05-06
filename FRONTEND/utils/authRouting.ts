import type { User } from '@/services/api';

type AppRoute = '/business-tabs' | '/family-setup' | '/welcome' | '/account-type';

/**
 * Returns the destination route for authenticated users based on tenant type.
 */
export function getAuthenticatedHomeRoute(user: User | null, fallbackRoute: AppRoute = '/welcome'): AppRoute {
  const tenantType = user?.tenantType;

  if (tenantType === 'BUSINESS') {
    return '/business-tabs';
  }

  if (tenantType === 'FAMILY') {
    return '/family-setup';
  }

  return fallbackRoute;
}
