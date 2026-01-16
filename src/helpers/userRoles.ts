import { ROLES_TYPES } from '../config/constant';

interface User {
  role: string | null;
  super_master_user?: boolean;
}

interface CategoryGroupFiltersVisibilityParams {
  user: User | null;
  delegateUserRole?: string;
}

export function shouldShowCategoryGroupFilters({
  user,
  delegateUserRole
}: CategoryGroupFiltersVisibilityParams): boolean {
  if (!user) {
    return false;
  }

  // If user is super_master_user, validate the delegate user role from query param
  if (user.super_master_user) {
    return delegateUserRole === ROLES_TYPES.CAFE;
  }

  // Otherwise validate the authenticated user's role
  return user.role === ROLES_TYPES.CAFE;
}