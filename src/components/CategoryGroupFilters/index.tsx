import React from 'react';
import CloseButton from '../Icons/CloseButton';
import { useCategoryGroupFilters } from '../../hooks/useCategoryGroupFilters';

interface CategoryGroupFiltersProps {
  onFilterSelect?: (groupName: string | null) => void;
}

export const CategoryGroupFilters: React.FC<CategoryGroupFiltersProps> = ({
  onFilterSelect
}) => {
  const { 
    categoryGroups, 
    activeFilter, 
    handleTagClick, 
    handleCloseClick, 
    clearFilters,
    isLoading,
    error
  } = useCategoryGroupFilters();

  // Notify parent component when filter changes
  React.useEffect(() => {
    onFilterSelect?.(activeFilter);
  }, [activeFilter, onFilterSelect]);

  const handleTagClickEvent = (groupName: string) => {
    handleTagClick(groupName);
  };

  const handleCloseClickEvent = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag click event
    handleCloseClick();
  };

  // Don't render if there's an error or no groups to show
  if (error || (!isLoading && categoryGroups.length === 0)) {
    return null;
  }

  return (
    <div className="w-full bg-white py-4 px-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-cera-medium text-gray-text-state">Filtrar por:</h3>
        
        <div className="flex flex-wrap justify-center gap-3">
          {isLoading ? (
            <div className="text-sm text-gray-text-state">Cargando filtros...</div>
          ) : (
            categoryGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleTagClickEvent(group.name)}
                className={`py-2 text-sm font-cera-medium rounded-full transition-colors relative ${
                  activeFilter === group.name
                    ? 'bg-green-100 text-white px-6'
                    : 'bg-green-50 text-green-100 hover:bg-yellow-active hover:text-white px-4'
                }`}
              >
                <span>{group.name}</span>
                {activeFilter === group.name && (
                  <CloseButton 
                    size="20" 
                    className="w-5 h-5 absolute -top-2 -right-2" 
                    onClick={handleCloseClickEvent}
                  />
                )}
              </button>
            ))
          )}
        </div>

        {activeFilter && (
          <button
            onClick={clearFilters}
            className="text-xs font-cera-regular text-gray-text-state hover:text-green-100 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      
      {activeFilter && (
        <div className="mt-3 text-xs font-cera-regular text-gray-text-state text-center">
          Mostrando resultados para: <span className="font-cera-medium text-green-100">{activeFilter}</span>
        </div>
      )}
    </div>
  );
};