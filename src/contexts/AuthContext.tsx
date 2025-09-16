import React, { createContext, useContext, useState, useEffect } from 'react';
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';
import Util from '../others/util';
import { UserProfile } from '../models/userProfile';

interface AuthContextType {
  userRole: number | null;
  setUserRole: (role: number | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loggedIn = LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true';
    const role = LocalStorageUtil.getItem(Constants.USER_Role);
    const profile = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile;
    
    setIsLoggedInState(loggedIn);
    if (profile && loggedIn) {
      setUserProfileState(profile);
    }
    if (role && loggedIn) {
      const roleNum = parseInt(role);
      setUserRoleState(roleNum);
      Util.loadNavItemsForUser(roleNum);
    }
  }, []);

  // Watch for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true';
      const role = LocalStorageUtil.getItem(Constants.USER_Role);
      const profile = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile;
      
      setIsLoggedInState(loggedIn);
      if (profile && loggedIn) {
        setUserProfileState(profile);
      }
      if (role && loggedIn) {
        const roleNum = parseInt(role);
        setUserRoleState(roleNum);
        Util.loadNavItemsForUser(roleNum);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setUserRole = (role: number | null) => {
    setUserRoleState(role);
    if (role) {
      LocalStorageUtil.setItem(Constants.USER_Role, role.toString());
      Util.loadNavItemsForUser(role);
    }
  };

  const setIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedInState(loggedIn);
    LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, loggedIn.toString());
    if (!loggedIn) {
      setUserRoleState(null);
      setUserProfileState(null);
      LocalStorageUtil.removeItem(Constants.USER_Role);
      LocalStorageUtil.removeItem(Constants.USER_PROFILE);
    }
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      LocalStorageUtil.setItemObject(Constants.USER_PROFILE, profile);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, isLoggedIn, setIsLoggedIn, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};