import { useState, useCallback } from 'react';

/**
 * useSelection hook for managing selection state.
 * @param initialSelected - initial selected IDs (default: empty array)
 * @returns [selectedIds, handleSelect]
 */
export function useSelection<T>(initialSelected: T[] = []): [T[], (id: T) => void] {
  const [selectedIds, setSelectedIds] = useState<T[]>(initialSelected);

  const handleSelect = useCallback((id: T) => {
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter(selectedId => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  }, []);

  return [selectedIds, handleSelect];
}