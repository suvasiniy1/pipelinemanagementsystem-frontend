import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;
  private currentUserId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private sessionInfo: any = null;

  async startConnection(userId?: string): Promise<void> {
    if (this.connection && this.isConnected && this.currentUserId === userId) {
      return;
    }

    this.currentUserId = userId || null;
    
    // Check if user is still logged in
    if (!this.isUserLoggedIn()) {
      console.log('User not logged in, skipping SignalR connection');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${window.config?.ServicesBaseURL?.replace('/api', '')}/notificationHub`, {
        withCredentials: false,
        accessTokenFactory: () => LocalStorageUtil.getItem(Constants.ACCESS_TOKEN) || ''
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount < 3) return 1000;
          if (retryContext.previousRetryCount < 5) return 5000;
          return 10000;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();

    try {
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('SignalR Connected');

      if (this.currentUserId) {
        await this.connection.invoke('JoinGroup', this.currentUserId);
      }

    } catch (error) {
      console.error('SignalR Connection Error:', error);
      this.isConnected = false;
      this.handleConnectionError(error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveNotification', (payload: any) => {
      this.handleNotification(payload);
    });

    this.connection.on('ConnectionEstablished', (info: any) => {
      this.sessionInfo = info;
      console.log('Session established:', info);
      
      if (info.sessionCount > 1) {
        toast.info(`You are logged in from ${info.sessionCount} devices`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });

    this.connection.on('Connected', (connectionId: string) => {
      console.log('Connected with ID:', connectionId);
    });

    this.connection.onreconnecting(() => {
      console.log('SignalR Reconnecting...');
      this.isConnected = false;
      this.reconnectAttempts++;
    });

    this.connection.onreconnected(() => {
      console.log('SignalR Reconnected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      if (this.currentUserId) {
        this.connection?.invoke('JoinGroup', this.currentUserId);
      }
      
      toast.success('Connection restored', {
        position: "top-right",
        autoClose: 2000,
      });
    });

    this.connection.onclose((error) => {
      console.log('SignalR Connection Closed:', error);
      this.isConnected = false;
      this.handleConnectionError(error);
    });
  }

  private handleConnectionError(error: any): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error('Connection lost. Please refresh the page.', {
        position: "top-right",
        autoClose: false,
      });
      return;
    }

    // Check if session expired
    if (!this.isUserLoggedIn()) {
      console.log('Session expired, stopping SignalR');
      this.stopConnection();
      return;
    }

    // Retry connection after delay
    setTimeout(() => {
      if (!this.isConnected && this.currentUserId) {
        this.startConnection(this.currentUserId);
      }
    }, 5000);
  }

  private isUserLoggedIn(): boolean {
    return LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === 'true' &&
           LocalStorageUtil.getItem(Constants.ACCESS_TOKEN) !== null;
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        if (this.currentUserId) {
          await this.connection.invoke('LeaveGroup', this.currentUserId);
        }
        await this.connection.stop();
      } catch (error) {
        console.error('Error stopping connection:', error);
      }
      
      this.isConnected = false;
      this.currentUserId = null;
      this.sessionInfo = null;
      console.log('SignalR Disconnected');
    }
  }

  private handleNotification(payload: any): void {
    console.log('Received notification:', payload);
    
    // Validate notification
    if (!payload || typeof payload !== 'object') {
      console.warn('Invalid notification payload:', payload);
      return;
    }

    // Show toast notification
    if (payload.message) {
      const toastType = payload.type || 'info';
      const options = {
        position: "top-right" as const,
        autoClose: payload.autoClose || 5000,
      };
      
      switch (toastType) {
        case 'success':
          toast.success(payload.message, options);
          break;
        case 'error':
          toast.error(payload.message, options);
          break;
        case 'warning':
          toast.warning(payload.message, options);
          break;
        default:
          toast.info(payload.message, options);
      }
    }

    // Emit custom event for components to listen
    window.dispatchEvent(new CustomEvent('signalr-notification', { 
      detail: payload 
    }));
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getSessionInfo(): any {
    return this.sessionInfo;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

export default new SignalRService();