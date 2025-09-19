import React, { createContext, useContext, useState, useEffect } from 'react';
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';
import Util from '../others/util';
import { UserProfile } from '../models/userProfile';
import SecureStorage from '../others/secureStorage';

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
    setIsLoggedInState(loggedIn);
    
    // Load obfuscated role from localStorage on app start
    if (loggedIn) {
      const role = SecureStorage.getSecureItem(Constants.USER_Role);
      if (role) {
        const roleNum = parseInt(role);
        setUserRoleState(roleNum);
        Util.loadNavItemsForUser(roleNum);
      }
    }
  }, []);



  const setUserRole = (role: number | null) => {
    setUserRoleState(role);
    if (role) {
      // Store obfuscated role in localStorage
      SecureStorage.setSecureItem(Constants.USER_Role, role.toString());
      Util.loadNavItemsForUser(role);
    }
  };

  const setIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedInState(loggedIn);
    LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, loggedIn.toString());
    if (!loggedIn) {
      setUserRoleState(null);
      setUserProfileState(null);
      LocalStorageUtil.removeItem(Constants.USER_LOGGED_IN);
      LocalStorageUtil.removeItem(Constants.ACCESS_TOKEN);
      LocalStorageUtil.removeItem(Constants.TOKEN_EXPIRATION_TIME);
      SecureStorage.removeSecureItem(Constants.USER_Role);
    }
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
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