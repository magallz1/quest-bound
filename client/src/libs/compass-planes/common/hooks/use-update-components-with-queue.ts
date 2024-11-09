import { useComponents, useUpdateComponent } from '@/libs/compass-api';
import { useEffect, useState } from 'react';

/**
 * Wraps useUpdateComponent from @/libs/compass-api with queue management.
 *
 * Shares a component update queue with all instances.
 *
 * Maintains a list of components which have failed to update.
 */
export const useUpdateComponentsWithQueue = (
  sheetId: string,
  cacheOnly?: boolean,
  activeTabId?: string,
) => {
  const [failedUpdateIds, setFailedUpdateIds] = useState<string[]>([]);
  const { components, loading: componentsLoading } = useComponents(sheetId, cacheOnly, activeTabId);

  useEffect(() => {
    if (failedUpdateIds.length === 0) return;

    const deletedFailedIds = failedUpdateIds.filter((id) => {
      return !components.find((c) => c.id === id);
    });

    removeFailedUpdateIds(deletedFailedIds);
  }, [components]);

  const addFailedUpdateIds = (ids: string[]) => {
    const idSet = new Set<string>(failedUpdateIds);
    ids.forEach((id) => idSet.add(id));
    setFailedUpdateIds(Array.from(idSet));
    if (ids.length > 0) {
      console.warn('Failed to update components:', ids);
    }
  };

  const removeFailedUpdateIds = (ids: string[]) => {
    setFailedUpdateIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const { updateComponent, updateComponents, error, loading } = useUpdateComponent({
    sheetId,
    addFailedUpdateIds,
    removeFailedUpdateIds,
    cacheOnly,
    debounceTime: 500,
  });

  return {
    updateComponent,
    updateComponents,
    components,
    failedUpdateIds,
    error,
    loading,
    componentsLoading,
  };
};
