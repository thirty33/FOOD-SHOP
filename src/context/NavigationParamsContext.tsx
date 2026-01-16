import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavigationParams, PERSISTENT_PARAMS } from '../config/navigationParams';

interface NavigationParamsContextType {
  params: NavigationParams;
  setParam: (key: keyof NavigationParams, value: string | undefined) => void;
  setParams: (newParams: Partial<NavigationParams>) => void;
  clearParams: () => void;
  getParam: (key: keyof NavigationParams) => string | undefined;
}

const NavigationParamsContext = createContext<NavigationParamsContextType | undefined>(undefined);

interface NavigationParamsProviderProps {
  children: ReactNode;
}

export function NavigationParamsProvider({ children }: NavigationParamsProviderProps) {
  const [params, setParamsState] = useState<NavigationParams>({});
  const [searchParams] = useSearchParams();

  // Sync params from URL on mount and URL changes
  useEffect(() => {
    const urlParams: NavigationParams = {};

    PERSISTENT_PARAMS.forEach((paramKey) => {
      const value = searchParams.get(paramKey);
      if (value) {
        urlParams[paramKey] = value;
      }
    });

    // Only update if there are params in URL
    if (Object.keys(urlParams).length > 0) {
      setParamsState(prev => ({ ...prev, ...urlParams }));
    }
  }, [searchParams]);

  const setParam = useCallback((key: keyof NavigationParams, value: string | undefined) => {
    setParamsState(prev => {
      if (value === undefined) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const setParams = useCallback((newParams: Partial<NavigationParams>) => {
    setParamsState(prev => {
      const updated = { ...prev };
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined) {
          delete updated[key as keyof NavigationParams];
        } else {
          updated[key as keyof NavigationParams] = value;
        }
      });
      return updated;
    });
  }, []);

  const clearParams = useCallback(() => {
    setParamsState({});
  }, []);

  const getParam = useCallback((key: keyof NavigationParams) => {
    return params[key];
  }, [params]);

  return (
    <NavigationParamsContext.Provider value={{ params, setParam, setParams, clearParams, getParam }}>
      {children}
    </NavigationParamsContext.Provider>
  );
}

export function useNavigationParamsContext() {
  const context = useContext(NavigationParamsContext);
  if (context === undefined) {
    throw new Error('useNavigationParamsContext must be used within a NavigationParamsProvider');
  }
  return context;
}