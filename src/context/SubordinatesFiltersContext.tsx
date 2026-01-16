import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SubordinatesFilters {
    page: number;
    company_search: string;
    branch_search: string;
    user_search: string;
    start_date: string;
    end_date: string;
    order_status: string;
}

interface SubordinatesFiltersContextType {
    filters: SubordinatesFilters;
    setPage: (page: number) => void;
    setFilter: (name: keyof SubordinatesFilters, value: string | number) => void;
    setFilters: (filters: Partial<SubordinatesFilters>) => void;
    resetFilters: () => void;
}

const DEFAULT_FILTERS: SubordinatesFilters = {
    page: 1,
    company_search: '',
    branch_search: '',
    user_search: '',
    start_date: '',
    end_date: '',
    order_status: '',
};

const SubordinatesFiltersContext = createContext<SubordinatesFiltersContextType | undefined>(undefined);

interface SubordinatesFiltersProviderProps {
    children: ReactNode;
}

export function SubordinatesFiltersProvider({ children }: SubordinatesFiltersProviderProps) {
    const [filters, setFiltersState] = useState<SubordinatesFilters>(DEFAULT_FILTERS);

    const setPage = useCallback((page: number) => {
        setFiltersState(prev => ({ ...prev, page }));
    }, []);

    const setFilter = useCallback((name: keyof SubordinatesFilters, value: string | number) => {
        setFiltersState(prev => ({ ...prev, [name]: value }));
    }, []);

    const setFilters = useCallback((newFilters: Partial<SubordinatesFilters>) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
    }, []);

    return (
        <SubordinatesFiltersContext.Provider value={{ filters, setPage, setFilter, setFilters, resetFilters }}>
            {children}
        </SubordinatesFiltersContext.Provider>
    );
}

export function useSubordinatesFilters() {
    const context = useContext(SubordinatesFiltersContext);
    if (context === undefined) {
        throw new Error('useSubordinatesFilters must be used within a SubordinatesFiltersProvider');
    }
    return context;
}

export { DEFAULT_FILTERS };
