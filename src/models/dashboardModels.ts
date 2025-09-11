export interface DashboardFolder {
  id: number;
  name: string;
  createdDate: string;
  createdBy?: string;
}

export interface DashboardReport {
  id: number;
  name: string;
  type: string;
  entity: string;
}

export interface Dashboard {
  id: number;
  name: string;
  folderId: number;
  folderName: string;
  createdDate: string;
  createdBy?: string;
  reports: DashboardReport[];
}

export interface CreateDashboardRequest {
  name: string;
  folderId: number;
}

export interface CreateFolderRequest {
  name: string;
}

export interface AddReportToDashboardRequest {
  dashboardId: number;
  reportId: number;
}

export interface RemoveReportFromDashboardRequest {
  dashboardId: number;
  reportId: number;
}