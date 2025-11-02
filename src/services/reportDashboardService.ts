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

  async addReportToDashboard(dashboardId: number, reportId: number, existingReports: string): Promise<ReportDashboard | null> {
    try {
      const updatedReports = existingReports ? `${existingReports},${reportId}` : reportId.toString();
      
      const dashboardData = {
        createdDate: new Date(),
        createdBy: 0,
        modifiedBy: 0,
        modifiedDate: new Date(),
        updatedBy: 0,
        updatedDate: new Date(),
        userId: 0,
        id: dashboardId,
        name: "string",
        folderId: 0,
        reports: updatedReports
      };
      
      const response = await this.postItemBySubURL(dashboardData, "AddReportDashboard");
      return response;
    } catch (error) {
      console.error('Error adding report to dashboard:', error);
      return null;
    }
  }
}