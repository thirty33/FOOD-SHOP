import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationParamsContext } from '../context/NavigationParamsContext';
import { NavigationParams, PERSISTENT_PARAMS } from '../config/navigationParams';

export function useNavigationParams() {
  const { params, setParam, setParams, clearParams, getParam } = useNavigationParamsContext();
  const navigate = useNavigate();

  /**
   * Build URLSearchParams including persistent params and additional params
   */
  const buildSearchParams = useCallback((additionalParams?: Record<string, string>) => {
    const searchParams = new URLSearchParams();

    // Add persistent params that exist in context
    PERSISTENT_PARAMS.forEach((paramKey) => {
      const value = params[paramKey];
      if (value) {
        searchParams.set(paramKey, value);
      }
    });

    // Add/override with additional params
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });
    }

    return searchParams;
  }, [params]);

  /**
   * Navigate to a path with persistent params + additional params
   */
  const navigateWithParams = useCallback((
    pathname: string,
    additionalParams?: Record<string, string>,
    options?: { replace?: boolean }
  ) => {
    const searchParams = buildSearchParams(additionalParams);
    const search = searchParams.toString();

    navigate({
      pathname,
      search: search ? `?${search}` : ''
    }, options);
  }, [navigate, buildSearchParams]);

  /**
   * Set params and navigate in one call
   */
  const setParamsAndNavigate = useCallback((
    newParams: Partial<NavigationParams>,
    pathname: string,
    additionalParams?: Record<string, string>,
    options?: { replace?: boolean }
  ) => {
    // Update context params
    setParams(newParams);

    // Build search params with new values
    const searchParams = new URLSearchParams();

    // Add existing persistent params
    PERSISTENT_PARAMS.forEach((paramKey) => {
      const value = newParams[paramKey] ?? params[paramKey];
      if (value) {
        searchParams.set(paramKey, value);
      }
    });

    // Add additional params
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });
    }

    const search = searchParams.toString();

    navigate({
      pathname,
      search: search ? `?${search}` : ''
    }, options);
  }, [navigate, params, setParams]);

  return {
    params,
    setParam,
    setParams,
    clearParams,
    getParam,
    buildSearchParams,
    navigateWithParams,
    setParamsAndNavigate
  };
}