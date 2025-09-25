import React from 'react';
import CloseButton from '../Icons/CloseButton';
import { useCategoryGroupFilters } from '../../hooks/useCategoryGroupFilters';
import { useAuth } from '../../hooks/useAuth';
import { ROLES_TYPES } from '../../config/constant';
import { capitalizeFirstLetter } from '../../helpers/texts';

interface CategoryGroupFiltersProps {
  onFilterSelect?: (groupName: string | null) => void;
}

export const CategoryGroupFilters: React.FC<CategoryGroupFiltersProps> = ({
  onFilterSelect
}) => {

  const { user } = useAuth();

  // Only show filters for CAFE users
  if (!user || user.role !== ROLES_TYPES.CAFE) {
    return null;
  }
  
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
    <div className="w-full bg-white py-6">
      <div className="flex flex-col items-center px-6 mb-4">
        <h3 className="text-sm font-cera-medium text-gray-text-state">Filtrar por:</h3>
      </div>
      
      <div 
        className="overflow-x-scroll pb-2 w-full px-6 mb-4 pt-3" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#286C39 #f1f1f1'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .overflow-x-scroll::-webkit-scrollbar {
              height: 6px;
            }
            .overflow-x-scroll::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .overflow-x-scroll::-webkit-scrollbar-thumb {
              background: #286C39;
              border-radius: 3px;
            }
            .overflow-x-scroll::-webkit-scrollbar-thumb:hover {
              background: #1f5c2e;
            }
          `
        }} />
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {isLoading ? (
            <div className="text-sm text-gray-text-state">Cargando filtros...</div>
          ) : (
            categoryGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleTagClickEvent(group.name)}
                className={`py-2 text-sm font-cera-medium rounded-full transition-colors relative flex-shrink-0 ${
                  activeFilter === group.name
                    ? 'bg-green-100 text-white px-6'
                    : 'bg-green-50 text-green-100 hover:bg-yellow-active hover:text-white px-4'
                }`}
              >
                <span>{capitalizeFirstLetter(group.name)}</span>
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
      </div>

      <div className="flex flex-col items-center px-6 space-y-3">
        {activeFilter && (
          <button
            onClick={clearFilters}
            className="text-xs font-cera-regular text-gray-text-state hover:text-green-100 underline"
          >
            Limpiar filtros
          </button>
        )}
        
        {activeFilter && (
          <div className="text-xs font-cera-regular text-gray-text-state text-center">
            Mostrando resultados para: <span className="font-cera-medium text-green-100">{capitalizeFirstLetter(activeFilter)}</span>
          </div>
        )}
      </div>
    </div>
  );
};