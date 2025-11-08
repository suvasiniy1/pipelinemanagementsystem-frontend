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
      const folderData = {
        createdDate: new Date(),
        createdBy: 0,
        modifiedBy: 0,
        modifiedDate: new Date(),
        updatedBy: 0,
        updatedDate: new Date(),
        userId: 0,
        id: 0,
        name: folderName
      };
      
      const response = await this.postItemBySubURL(folderData, "AddDashboardFolder");
      return response;
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