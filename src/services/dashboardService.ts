import { 
  Dashboard, 
  DashboardFolder, 
  CreateDashboardRequest, 
  CreateFolderRequest, 
  AddReportToDashboardRequest, 
  RemoveReportFromDashboardRequest 
} from '../models/dashboardModels';

class DashboardService {
  private readonly DASHBOARDS_KEY = 'createdDashboards';
  private readonly FOLDERS_KEY = 'dashboardFolders';

  // Folder operations
  getFolders(): DashboardFolder[] {
    return JSON.parse(localStorage.getItem(this.FOLDERS_KEY) || '[]');
  }

  createFolder(request: CreateFolderRequest): DashboardFolder {
    const folders = this.getFolders();
    const newFolder: DashboardFolder = {
      id: Date.now(),
      name: request.name,
      createdDate: new Date().toLocaleDateString()
    };
    
    const updatedFolders = [...folders, newFolder];
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(updatedFolders));
    return newFolder;
  }

  // Dashboard operations
  getDashboards(): Dashboard[] {
    return JSON.parse(localStorage.getItem(this.DASHBOARDS_KEY) || '[]');
  }

  createDashboard(request: CreateDashboardRequest): Dashboard {
    const dashboards = this.getDashboards();
    const folders = this.getFolders();
    const folder = folders.find(f => f.id === request.folderId);
    
    const newDashboard: Dashboard = {
      id: Date.now(),
      name: request.name,
      folderId: request.folderId,
      folderName: folder?.name || 'Unknown',
      createdDate: new Date().toLocaleDateString(),
      reports: []
    };
    
    const updatedDashboards = [...dashboards, newDashboard];
    localStorage.setItem(this.DASHBOARDS_KEY, JSON.stringify(updatedDashboards));
    return newDashboard;
  }

  updateDashboard(dashboard: Dashboard): Dashboard {
    const dashboards = this.getDashboards();
    const updatedDashboards = dashboards.map(d => 
      d.id === dashboard.id ? dashboard : d
    );
    localStorage.setItem(this.DASHBOARDS_KEY, JSON.stringify(updatedDashboards));
    return dashboard;
  }

  // Report-Dashboard mapping operations
  addReportToDashboard(request: AddReportToDashboardRequest): Dashboard {
    const dashboards = this.getDashboards();
    const reports = JSON.parse(localStorage.getItem('createdReports') || '[]');
    const report = reports.find((r: any) => r.id === request.reportId);
    
    if (!report) throw new Error('Report not found');
    
    const dashboard = dashboards.find(d => d.id === request.dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');
    
    const reportToAdd = {
      id: report.id,
      name: report.name,
      type: report.type,
      entity: report.entity
    };
    
    const updatedDashboard = {
      ...dashboard,
      reports: [...dashboard.reports, reportToAdd]
    };
    
    return this.updateDashboard(updatedDashboard);
  }

  removeReportFromDashboard(request: RemoveReportFromDashboardRequest): Dashboard {
    const dashboards = this.getDashboards();
    const dashboard = dashboards.find(d => d.id === request.dashboardId);
    
    if (!dashboard) throw new Error('Dashboard not found');
    
    const updatedDashboard = {
      ...dashboard,
      reports: dashboard.reports.filter(r => r.id !== request.reportId)
    };
    
    return this.updateDashboard(updatedDashboard);
  }

  getDashboardsByFolder(folderId: number): Dashboard[] {
    return this.getDashboards().filter(d => d.folderId === folderId);
  }
}

export const dashboardService = new DashboardService();