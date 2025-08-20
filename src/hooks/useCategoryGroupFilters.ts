import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoryService } from '../services/category';
import { CategoryGroup } from '../types/categories';
import { useQueryParams } from './useQueryParams';

export const useCategoryGroupFilters = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const queryParams = useQueryParams(['delegate_user']);
  
  // State for category groups from API
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to track active filter (null means no filter active)
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Fetch category groups from API
  useEffect(() => {
    const fetchCategoryGroups = async () => {
      if (!menuId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const groups = await categoryService.getCategoryGroups(menuId, queryParams);
        setCategoryGroups(groups);
      } catch (err) {
        console.error('Error fetching category groups:', err);
        setError('Error loading category groups');
        // Fallback to empty array on error
        setCategoryGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryGroups();
  }, [menuId, queryParams.delegate_user]);

  // Handle tag click - activate if inactive, deactivate if active
  const handleTagClick = (groupName: string) => {
    if (activeFilter === groupName) {
      // If clicking on active tag, deactivate it
      setActiveFilter(null);
    } else {
      // If clicking on inactive tag, activate it (deactivates others automatically)
      setActiveFilter(groupName);
    }
  };

  // Handle close icon click - always deactivate
  const handleCloseClick = () => {
    setActiveFilter(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter(null);
  };

  return {
    categoryGroups,
    activeFilter,
    handleTagClick,
    handleCloseClick,
    clearFilters,
    isLoading,
    error
  };
};