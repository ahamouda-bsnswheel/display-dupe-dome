import { useState, useEffect, useCallback } from "react";

const PENDING_CHANGES_KEY = "noc_pending_profile_changes";

export interface PendingProfileChanges {
  private_email?: string;
  private_phone?: string;
  marital?: string;
  children?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  certificate?: string;
  study_field?: string;
  study_school?: string;
}

export const usePendingProfileChanges = (employeeId?: number) => {
  const [pendingChanges, setPendingChanges] = useState<PendingProfileChanges>({});

  const getStorageKey = useCallback(() => {
    return employeeId ? `${PENDING_CHANGES_KEY}_${employeeId}` : PENDING_CHANGES_KEY;
  }, [employeeId]);

  // Load pending changes from localStorage
  useEffect(() => {
    if (!employeeId) return;
    
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      try {
        setPendingChanges(JSON.parse(stored));
      } catch {
        setPendingChanges({});
      }
    }
  }, [employeeId, getStorageKey]);

  // Save changes to localStorage
  const saveChanges = useCallback((changes: Partial<PendingProfileChanges>) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev, ...changes };
      localStorage.setItem(getStorageKey(), JSON.stringify(newChanges));
      return newChanges;
    });
  }, [getStorageKey]);

  // Clear all pending changes
  const clearChanges = useCallback(() => {
    localStorage.removeItem(getStorageKey());
    setPendingChanges({});
  }, [getStorageKey]);

  // Check if a specific field has pending changes
  const hasChange = useCallback((field: keyof PendingProfileChanges) => {
    return pendingChanges[field] !== undefined;
  }, [pendingChanges]);

  // Get the pending value for a field (or undefined if no pending change)
  const getPendingValue = useCallback((field: keyof PendingProfileChanges) => {
    return pendingChanges[field];
  }, [pendingChanges]);

  // Check if there are any pending changes
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  // Get all changed field names
  const changedFields = Object.keys(pendingChanges) as (keyof PendingProfileChanges)[];

  return {
    pendingChanges,
    saveChanges,
    clearChanges,
    hasChange,
    getPendingValue,
    hasPendingChanges,
    changedFields,
  };
};
