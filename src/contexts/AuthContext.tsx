import React, { createContext, useContext, useState, useEffect } from 'react';
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';
import Util from '../others/util';
import { UserProfile } from '../models/userProfile';
import SecureStorage from '../others/secureStorage';
import { UserPreferencesService } from '../services/userPreferencesService';
import { ErrorBoundary } from 'react-error-boundary';

interface UserPreference {
  id: number;
  userId: number;
  gridName: string;
  preferencesJson: string;
  createdDate: string;
  createdBy: number;
  modifiedBy: number;
  modifiedDate: string;
}

interface AuthContextType {
  userRole: number | null;
  setUserRole: (role: number | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  userPreferences: UserPreference[];
  setUserPreferences: (preferences: UserPreference[]) => void;
  updateUserPreference: (gridName: string, preferences: any) => void;
  loadUserPreferences: (userId: number) => Promise<void>;
  getPreferencesForGrid: (gridName: string) => UserPreference | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [userPreferences, setUserPreferencesState] = useState<UserPreference[]>([]);
  const userPreferencesService = new UserPreferencesService(ErrorBoundary);

  useEffect(() => {
    const loggedIn = LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true';
    setIsLoggedInState(loggedIn);
    
    // Load obfuscated role from localStorage on app start
    if (loggedIn) {
      let roleNum: number | null = null;
      const role = SecureStorage.getSecureItem(Constants.USER_Role);
      if (role) {
        roleNum = parseInt(role);
        setUserRoleState(roleNum);
        Util.loadNavItemsForUser(roleNum);
      }
      
      // Load user profile from localStorage
      try {
        const storedProfile = LocalStorageUtil.getItemObject(Constants.USER_PROFILE);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile as string);
          setUserProfileState(profile);
          console.log('Loaded userProfile from localStorage:', profile);
          
          // Load user preferences from API on app start
          if (profile.userId) {
            loadUserPreferences(profile.userId);
          }
        } else {
          // If no stored profile, try to reconstruct from available data
          const userName = LocalStorageUtil.getItem(Constants.User_Name);
          if (userName) {
            // Create a minimal profile - you may need to adjust this based on your needs
            const reconstructedProfile = {
              user: userName,
              userId: 107, // You might need to get this from somewhere else
              role: roleNum
            };
            setUserProfileState(reconstructedProfile as any);
            console.log('Reconstructed userProfile:', reconstructedProfile);
          }
        }
      } catch (error) {
        console.error('Error loading user profile from storage:', error);
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
      LocalStorageUtil.removeItem(Constants.USER_PROFILE);
      SecureStorage.removeSecureItem(Constants.USER_Role);
    }
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      LocalStorageUtil.setItemObject(Constants.USER_PROFILE, JSON.stringify(profile));
      // Extract and store user preferences from login response
      if ((profile as any).userpresence && Array.isArray((profile as any).userpresence)) {
        console.log('Loading user preferences from login response:', (profile as any).userpresence);
        setUserPreferencesState((profile as any).userpresence);
      } else if (profile.userId) {
        // Load preferences from API if not in login response
        loadUserPreferences(profile.userId);
      }
    } else {
      LocalStorageUtil.removeItem(Constants.USER_PROFILE);
      setUserPreferencesState([]);
    }
  };

  const setUserPreferences = (preferences: UserPreference[]) => {
    setUserPreferencesState(preferences);
  };

  const loadUserPreferences = async (userId: number) => {
    try {
      const response = await userPreferencesService.getUserPreferencesByUserId(userId);
      if (Array.isArray(response)) {
        setUserPreferencesState(response);
        console.log('Loaded user preferences:', response);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const getPreferencesForGrid = (gridName: string): UserPreference | null => {
    return userPreferences.find(p => p.gridName === gridName) || null;
  };

  const updateUserPreference = (gridName: string, preferences: any) => {
    setUserPreferencesState(prev => {
      const existing = prev.find(p => p.gridName === gridName);
      if (existing) {
        return prev.map(p => 
          p.gridName === gridName 
            ? { ...p, preferencesJson: JSON.stringify(preferences) }
            : p
        );
      } else {
        return [...prev, {
          id: 0,
          userId: userProfile?.userId || 0,
          gridName,
          preferencesJson: JSON.stringify(preferences),
          createdDate: new Date().toISOString(),
          createdBy: userProfile?.userId || 0,
          modifiedBy: userProfile?.userId || 0,
          modifiedDate: new Date().toISOString()
        }];
      }
    });
  };

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      setUserRole, 
      isLoggedIn, 
      setIsLoggedIn, 
      userProfile, 
      setUserProfile, 
      userPreferences, 
      setUserPreferences, 
      updateUserPreference,
      loadUserPreferences,
      getPreferencesForGrid
    }}>
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