import { BaseService } from "./BaseService";

export interface DashboardFolder {
  id: number;
  name: string;
  createdDate: Date;
  createdBy: number;
  modifiedBy: number;
  modifiedDate: Date;
  updatedBy: number;
  updatedDate: Date;
  userId: number;
}

export class DashboardFolderService extends BaseService<DashboardFolder> {
  constructor(errorHandler: any) {
    super("DashboardFolder", "Dashboard Folder", errorHandler);
  }

  async getAllFolders(): Promise<DashboardFolder[]> {
    try {
      const response = await this.getItemsBySubURL("GetAllDashboardFolder");
      return response || [];
    } catch (error) {
      console.error('Error fetching dashboard folders:', error);
      return [];
    }
  }

  async createFolder(folderName: string): Promise<DashboardFolder | null> {
    try {
      const Util = (await import('../others/util')).default;
      const userId = Util.UserProfile()?.userId || 0;
      
      const folderData = {
        createdDate: new Date(),
        createdBy: userId,
        modifiedBy: userId,
        modifiedDate: new Date(),
        updatedBy: userId,
        updatedDate: new Date(),
        userId: userId,
        id: 0,
        name: folderName
      };
      
      const response = await this.postItemBySubURL(folderData, "AddDashboardFolder");
      return response?.success ? response.result : response;
    } catch (error) {
      console.error('Error creating dashboard folder:', error);
      return null;
    }
  }

  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      await this.delete(folderId);
      return true;
    } catch (error) {
      console.error('Error deleting dashboard folder:', error);
      return false;
    }
  }
}