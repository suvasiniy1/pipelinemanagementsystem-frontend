import { BaseService } from "./BaseService";

export interface ReportDashboard {
  id: number;
  name: string;
  folderId: number;
  reports: string;
  createdDate: Date;
  createdBy: number;
  modifiedBy: number;
  modifiedDate: Date;
  updatedBy: number;
  updatedDate: Date;
  userId: number;
}

export class ReportDashboardService extends BaseService<ReportDashboard> {
  constructor(errorHandler: any) {
    super("ReportDashboard", "Report Dashboard", errorHandler);
  }

  async getAllDashboards(): Promise<ReportDashboard[]> {
    try {
      const response = await this.getItemsBySubURL("GetAllReportDashboard");
      return response || [];
    } catch (error) {
      console.error('Error fetching report dashboards:', error);
      return [];
    }
  }

  async getDashboardById(dashboardId: number): Promise<ReportDashboard | null> {
    try {
      const response = await this.getItemsBySubURL(`GetReportDashboardById/${dashboardId}`);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard by ID:', error);
      return null;
    }
  }

  async updateDashboardReports(dashboardId: number, reportsString: string, folderId: number, dashboardName: string, createdBy: number): Promise<ReportDashboard | null> {
    try {
      const dashboardData = {
        createdDate: new Date().toISOString(),
        createdBy: createdBy,
        modifiedBy: createdBy,
        modifiedDate: new Date().toISOString(),
        id: dashboardId,
        name: dashboardName,
        folderId: folderId,
        reports: reportsString
      };
      
      const response = await this.postItemBySubURL(dashboardData, "AddReportDashboard");
      return response;
    } catch (error) {
      console.error('Error updating dashboard reports:', error);
      return null;
    }
  }

  async addReportToDashboard(dashboardId: number, reportId: number, existingReports: string, folderId: number, dashboardName: string, createdBy: number): Promise<ReportDashboard | null> {
    try {
      const updatedReports = existingReports ? `${existingReports},${reportId}` : reportId.toString();
      
      const dashboardData = {
        createdDate: new Date().toISOString(),
        createdBy: createdBy,
        modifiedBy: createdBy,
        modifiedDate: new Date().toISOString(),
        id: dashboardId,
        name: dashboardName,
        folderId: folderId,
        reports: updatedReports
      };
      
      const response = await this.postItemBySubURL(dashboardData, "AddReportDashboard");
      return response;
    } catch (error) {
      console.error('Error adding report to dashboard:', error);
      return null;
    }
  }

  async createDashboard(dashboardData: Partial<ReportDashboard>): Promise<ReportDashboard | null> {
    try {
      const response = await this.postItemBySubURL(dashboardData, "AddReportDashboard");
      return response?.success ? response.result : response;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      return null;
    }
  }
}