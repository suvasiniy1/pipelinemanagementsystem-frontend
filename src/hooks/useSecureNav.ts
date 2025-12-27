import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import SecureNavService from '../services/secureNavService';
import RoleValidator from '../others/RoleValidator';
import Util from '../others/util';

interface UseSecureNavResult {
  isAuthorized: (navItem: string) => boolean;
  refreshPermissions: () => Promise<void>;
  isLoading: boolean;
}

export const useSecureNav = (): UseSecureNavResult => {
  const { userRole } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [lastValidation, setLastValidation] = useState(0);

  const refreshPermissions = useCallback(async () => {
    if (!userRole) return;
    
    setIsLoading(true);
    try {
      // Simply reload nav items for the current role
      Util.loadNavItemsForUser(userRole);
      setLastValidation(Date.now());
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  const isAuthorized = useCallback((navItem: string): boolean => {
    // Validate user role first
    if (!RoleValidator.validateUserRole()) {
      return false;
    }

    // Use Util's enhanced authorization check
    return Util.isAuthorized(navItem);
  }, [lastValidation]);

  // Refresh permissions on mount and role change
  useEffect(() => {
    if (userRole !== null && userRole !== undefined) {
      refreshPermissions();
    }
  }, [userRole, refreshPermissions]);

  // Periodic validation
  useEffect(() => {
    const interval = setInterval(() => {
      if (userRole !== null && userRole !== undefined) {
        RoleValidator.validateUserRole();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userRole]);

  return {
    isAuthorized,
    refreshPermissions,
    isLoading
  };
};

export default useSecureNav;