import { UserProfile } from '../models/userProfile';

interface NavPermissionResponse {
  isAuthorized: boolean;
  userRole: number;
  allowedNavItems: string[];
}

class SecureNavService {
  private static readonly API_BASE = window.config.ServicesBaseURL;
  private static permissionCache: Map<string, { data: NavPermissionResponse; timestamp: number }> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Validates navigation permission with server
   */
  public static async validateNavPermission(navItem: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!token) return false;

      const cacheKey = `${navItem}_${token.slice(-10)}`;
      const cached = this.permissionCache.get(cacheKey);
      
      // Return cached result if valid
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        return cached.data.allowedNavItems.includes(navItem);
      }

      const response = await fetch(`${this.API_BASE}/auth/validate-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permission: navItem })
      });

      if (!response.ok) return false;

      const result: NavPermissionResponse = await response.json();
      
      // Cache the result
      this.permissionCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result.isAuthorized && result.allowedNavItems.includes(navItem);
    } catch (error) {
      console.error('Permission validation failed:', error);
      return false;
    }
  }

  /**
   * Gets user permissions from server
   */
  public static async getUserPermissions(): Promise<string[]> {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!token) return [];

      const response = await fetch(`${this.API_BASE}/auth/user-permissions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) return [];

      const result: NavPermissionResponse = await response.json();
      return result.allowedNavItems || [];
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      return [];
    }
  }

  /**
   * Clears permission cache
   */
  public static clearCache(): void {
    this.permissionCache.clear();
  }
}

export default SecureNavService;