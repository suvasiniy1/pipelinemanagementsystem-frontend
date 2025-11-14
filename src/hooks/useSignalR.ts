import { useEffect, useState, useCallback } from 'react';
import signalRService from '../services/signalRService';
import { useAuthContext } from '../contexts/AuthContext';
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';

let globalConnectionInitialized = false;

export const useSignalR = () => {
  const { userProfile } = useAuthContext();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  const checkConnectionStatus = useCallback(() => {
    const connected = signalRService.isConnectionActive();
    setIsConnected(connected);
    setSessionInfo(signalRService.getSessionInfo());
    return connected;
  }, []);

  useEffect(() => {
    let connectionTimeout: NodeJS.Timeout;
    
    const connectSignalR = async () => {
      if (!userProfile?.userId) return;
      
      // Check if user is still logged in
      const isLoggedIn = LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true';
      if (!isLoggedIn) {
        setConnectionError('User not logged in');
        return;
      }

      // Debounce connection attempts
      clearTimeout(connectionTimeout);
      connectionTimeout = setTimeout(async () => {
        try {
          await signalRService.startConnection(userProfile.userId.toString());
          setConnectionError(null);
          checkConnectionStatus();
        } catch (error) {
          console.error('Failed to connect SignalR:', error);
          setConnectionError(error instanceof Error ? error.message : 'Connection failed');
          setIsConnected(false);
        }
      }, 1000); // 1 second debounce
    };

    const handleNotification = (event: CustomEvent) => {
      const payload = event.detail;
      
      // Add timestamp if not present
      const notification = {
        ...payload,
        receivedAt: new Date().toISOString(),
        id: payload.id || Date.now().toString()
      };
      
      setNotifications(prev => {
        // Limit to last 50 notifications
        const updated = [...prev, notification].slice(-50);
        return updated;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only check if not already connected
        if (!signalRService.isConnectionActive()) {
          setTimeout(checkConnectionStatus, 2000);
        }
      }
    };

    const handleOnline = () => {
      // Only reconnect if not already connected
      if (userProfile?.userId && !signalRService.isConnectionActive()) {
        setTimeout(() => connectSignalR(), 3000);
      }
    };

    const handleBeforeUnload = () => {
      // Clean disconnect on page unload
      signalRService.stopConnection();
    };

    // Connect when user is authenticated (only once globally)
    if (userProfile?.userId && !globalConnectionInitialized) {
      globalConnectionInitialized = true;
      connectSignalR();
    }

    // Set up event listeners
    window.addEventListener('signalr-notification', handleNotification as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check connection status less frequently
    const statusInterval = setInterval(checkConnectionStatus, 60000); // Every 1 minute instead of 30 seconds

    return () => {
      clearTimeout(connectionTimeout);
      window.removeEventListener('signalr-notification', handleNotification as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(statusInterval);
      
      // Only disconnect if user is logging out
      const isLoggedIn = LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true';
      if (!isLoggedIn) {
        globalConnectionInitialized = false;
        signalRService.stopConnection();
      }
    };
  }, [userProfile?.userId, checkConnectionStatus]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const reconnect = useCallback(async () => {
    if (userProfile?.userId) {
      try {
        await signalRService.stopConnection();
        await signalRService.startConnection(userProfile.userId.toString());
        setConnectionError(null);
        checkConnectionStatus();
      } catch (error) {
        setConnectionError(error instanceof Error ? error.message : 'Reconnection failed');
      }
    }
  }, [userProfile?.userId, checkConnectionStatus]);

  return {
    isConnected,
    notifications,
    connectionError,
    sessionInfo,
    clearNotifications,
    removeNotification,
    reconnect,
    connectionState: signalRService.getConnectionState()
  };
};