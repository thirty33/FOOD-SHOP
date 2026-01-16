// Params that should persist across navigations
export const PERSISTENT_PARAMS = ['delegate_user', 'user_role'] as const;

export type PersistentParamKey = typeof PERSISTENT_PARAMS[number];

// Type for navigation params
export interface NavigationParams {
  delegate_user?: string;
  user_role?: string;
}
