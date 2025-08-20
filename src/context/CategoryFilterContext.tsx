import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategoryFilterContextType {
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | undefined>(undefined);

export const CategoryFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <CategoryFilterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </CategoryFilterContext.Provider>
  );
};

export const useCategoryFilter = () => {
  const context = useContext(CategoryFilterContext);
  if (context === undefined) {
    throw new Error('useCategoryFilter must be used within a CategoryFilterProvider');
  }
  return context;
};