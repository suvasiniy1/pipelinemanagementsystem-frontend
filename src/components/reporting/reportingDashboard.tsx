import { faChartBar, faChevronDown, faChevronRight, faFolder, faSearch, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, Button as BootstrapButton } from "react-bootstrap";
import { toast } from 'react-toastify';
import { AddEditDialog } from '../../common/addEditDialog';
import { ReportDefinition } from "../../models/reportModels";
import AddReportModal from "./AddReportModal";
import CreateButton from "./CreateButton";
import DashboardView from "./DashboardView";
import './reportingStyles.css';
import ReportView from "./ReportView";
import { ReportService } from '../../services/reportService';

const ReportingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Deal Conversion");
  const supportedChartsList = ["Deal Conversion", "Sales Performance", "Treatment Analysis", "User Performance", "Lead Source", "Pipeline Health"];
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedFrequencey, setSelectedFrequencey] = useState("");
  
  // New state for report creation and management
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [dashboardNameError, setDashboardNameError] = useState('');
  const [folderNameError, setFolderNameError] = useState('');
  const [createdReports, setCreatedReports] = useState<any[]>([]);
  const [createdDashboards, setCreatedDashboards] = useState<any[]>([]);
  const [dashboardFolders, setDashboardFolders] = useState<any[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeNavItem, setActiveNavItem] = useState("My Dashboard");
  const [createType, setCreateType] = useState(""); // "Report" or "Dashboard"
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'report'>('home');
  const [currentReport, setCurrentReport] = useState<{entity: string, reportType: string, reportDefinition?: ReportDefinition} | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<any>(null);
  
  const reportTypes = ["Performance", "Conversion", "Duration", "Progress", "Products"];

  // Load reports from API and folders from localStorage
  useEffect(() => {
    const loadReports = async () => {
      try {
        const reportService = new ReportService(null);
        const reports = await reportService.getReports();
        setCreatedReports(reports || []);
      } catch (error) {
        console.error('Error loading reports:', error);
        setCreatedReports([]);
      }
    };
    
    loadReports();
    
    const savedDashboards = localStorage.getItem('createdDashboards');
    if (savedDashboards) {
      setCreatedDashboards(JSON.parse(savedDashboards));
    }
    
    const savedFolders = localStorage.getItem('dashboardFolders');
    if (savedFolders) {
      setDashboardFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Refresh reports when needed
  const refreshReports = async () => {
    try {
      const reportService = new ReportService(null);
      const reports = await reportService.getReports();
      setCreatedReports(reports || []);
    } catch (error) {
      console.error('Error refreshing reports:', error);
    }
  };

  const handleCreateSelect = (type: string) => {
    setCreateType(type);
    if (type === "report") {
      setShowAddReportModal(true);
    } else {
      // Use same dashboard creation dialog as ReportView
      setShowCreateModal(true);
      setReportName('');
      setSelectedFolder('');
      setDashboardNameError('');
    }
  };



  const handleReportSubmit = (entity: string, reportType: string) => {
    // Navigate to report view without saving yet
    setCurrentReport({ entity, reportType });
    setCurrentView('report');
  };

  const handleSaveReport = (reportData: any) => {
    // Refresh reports from API after save
    refreshReports();
    
    // Update navigation to show the saved report
    setActiveNavItem(reportData.name);
  };

  const handleBackToDashboard = () => {
    setCurrentView('home');
    setCurrentReport(null);
  };

  const handleBackFromDashboard = () => {
    setCurrentView('home');
    setCurrentDashboard(null);
  };

  const handleDashboardClick = (dashboard: any) => {
    setCurrentDashboard(dashboard);
    setCurrentView('dashboard');
    setActiveNavItem(dashboard.name);
  };

  const handleDashboardReportClick = (report: any) => {
    const reportDefinition: ReportDefinition = {
      id: report.id,
      name: report.name,
      chartType: report.chartType || 'bar',
      frequency: report.frequency || 'daily',
      isPreview: false,
      isActive: true,
      isPublic: true,
      createdDate: report.createdDate || new Date().toISOString(),
      createdBy: 0,
      modifiedBy: 0,
      modifiedDate: report.modifiedDate || new Date().toISOString(),
      reportConditions: report.reportConditions || []
    };
    
    setCurrentReport({ 
      entity: report.entity, 
      reportType: report.type,
      reportDefinition: reportDefinition
    });
    setCurrentView('report');
  };

  const handleDeleteReport = (reportId: number) => {
    // Refresh reports from API after delete
    refreshReports();
  };

  const handleReportClick = (report: any) => {
    // Convert saved report to ReportDefinition format
    const reportDefinition: ReportDefinition = {
      id: report.id,
      name: report.name,
      chartType: report.chartType || 'bar',
      frequency: report.frequency || 'daily',
      isPreview: false,
      isActive: true,
      isPublic: true,
      createdDate: report.createdDate || new Date().toISOString(),
      createdBy: 0,
      modifiedBy: 0,
      modifiedDate: report.modifiedDate || new Date().toISOString(),
      reportConditions: report.reportConditions || []
    };
    
    setCurrentReport({ 
      entity: report.entity, 
      reportType: report.type,
      reportDefinition: reportDefinition
    });
    setCurrentView('report');
    setActiveNavItem(report.name);
  };

  const filteredReports = createdReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Navigation Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#f8f9fa', 
        borderRight: '1px solid #e4cb9a',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h5 style={{ marginBottom: '20px', color: '#3f3f3f' }}>Navigation</h5>
        
        {/* Create Button */}
        <CreateButton onSelect={handleCreateSelect} />
        
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon 
              icon={faSearch} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} 
            />
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', fontSize: '14px' }}
              size="sm"
            />
          </div>
        </div>
        
        {/* Dashboards Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '8px' }} />
            Dashboards
          </div>
          
          
          {/* Folders with Dashboards */}
          {dashboardFolders.map(folder => {
            const folderDashboards = createdDashboards.filter(d => d.folderId === folder.id.toString());
            const isExpanded = expandedFolders.has(folder.id.toString());
            
            return (
              <div key={folder.id} style={{ marginBottom: '5px' }}>
                {/* Folder Header */}
                <div 
                  style={{ 
                    padding: '8px 16px', 
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937'
                  }}
                  onClick={() => {
                    const newExpanded = new Set(expandedFolders);
                    if (isExpanded) {
                      newExpanded.delete(folder.id.toString());
                    } else {
                      newExpanded.add(folder.id.toString());
                    }
                    setExpandedFolders(newExpanded);
                  }}
                >
                  <FontAwesomeIcon 
                    icon={isExpanded ? faChevronDown : faChevronRight} 
                    style={{ marginRight: '8px', fontSize: '12px' }} 
                  />
                  {folder.name} ({folderDashboards.length})
                </div>
                
                {/* Dashboards in Folder */}
                {isExpanded && folderDashboards.map(dashboard => (
                  <div 
                    key={dashboard.id}
                    style={{ 
                      padding: '6px 16px 6px 40px', 
                      cursor: 'pointer',
                      backgroundColor: activeNavItem === dashboard.name ? '#e4cb9a' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}
                    onClick={() => handleDashboardClick(dashboard)}
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '8px', fontSize: '11px' }} />
                    {dashboard.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Reports Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '8px' }} />
            Reports
          </div>
          {createdReports.length === 0 ? (
            <div style={{ padding: '8px 16px', fontSize: '14px', color: '#6c757d' }}>
              No saved reports
            </div>
          ) : (
            createdReports.map(report => (
              <div 
                key={report.id}
                style={{ 
                  padding: '8px 16px', 
                  cursor: 'pointer',
                  backgroundColor: activeNavItem === report.name ? '#e4cb9a' : 'transparent',
                  borderRadius: '4px',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}
                onClick={() => handleReportClick(report)}
              >
                <div style={{ fontWeight: 'bold' }}>{report.name}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {report.entity} {report.type}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: currentView === 'report' ? '0' : '20px', overflowY: 'auto', height: '100vh' }}>
        {currentView === 'report' && currentReport ? (
          <ReportView 
            entity={currentReport.entity}
            reportType={currentReport.reportType}
            reportDefinition={currentReport.reportDefinition}
            onBack={handleBackToDashboard}
            onSave={handleSaveReport}
            onDelete={handleDeleteReport}
            onDashboardUpdate={(updatedDashboards) => {
              setCreatedDashboards(updatedDashboards);
              // If currently viewing a dashboard, update it
              if (currentDashboard) {
                const updatedCurrentDashboard = updatedDashboards.find(d => d.id === currentDashboard.id);
                if (updatedCurrentDashboard) {
                  setCurrentDashboard(updatedCurrentDashboard);
                }
              }
            }}
          />
        ) : currentView === 'dashboard' && currentDashboard ? (
          <DashboardView 
            dashboard={currentDashboard}
            onBack={handleBackFromDashboard}
            onReportClick={handleDashboardReportClick}
            onDashboardUpdate={(updatedDashboard) => {
              // Update the current dashboard state
              setCurrentDashboard(updatedDashboard);
              // Update the dashboards list
              const updatedDashboards = createdDashboards.map(d => 
                d.id === updatedDashboard.id ? updatedDashboard : d
              );
              setCreatedDashboards(updatedDashboards);
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <div>
              <FontAwesomeIcon icon={faChartBar} size="3x" className="mb-3" />
              <h5>Welcome to Reporting Dashboard</h5>
              <p>Create a new report or select an existing one from the sidebar to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Dashboard Dialog - Same as ReportView */}
      <AddEditDialog
        dialogIsOpen={showCreateModal}
        header="Create New Dashboard"
        dialogSize="lg"
        onSave={() => {
          if (!reportName.trim()) {
            setDashboardNameError('Dashboard name is required');
            return;
          }
          
          if (!selectedFolder) {
            toast.warning('Please select a folder for the dashboard');
            return;
          }
          
          const isDuplicate = createdDashboards.some(dashboard => 
            dashboard.name.toLowerCase() === reportName.trim().toLowerCase()
          );
          
          if (isDuplicate) {
            setDashboardNameError('Dashboard name already exists');
            return;
          }
          
          const selectedFolderObj = dashboardFolders.find(f => f.id.toString() === selectedFolder);
          
          const newDashboard = {
            id: Date.now(),
            name: reportName.trim(),
            folderId: selectedFolder,
            folderName: selectedFolderObj?.name || 'Unknown',
            createdDate: new Date().toLocaleDateString(),
            reports: []
          };
          
          const updatedDashboards = [...createdDashboards, newDashboard];
          setCreatedDashboards(updatedDashboards);
          localStorage.setItem('createdDashboards', JSON.stringify(updatedDashboards));
          
          setShowCreateModal(false);
          setShowCreateFolder(false);
          setReportName('');
          setSelectedFolder('');
          setNewFolderName('');
          setDashboardNameError('');
          setFolderNameError('');
          
          toast.success(`Dashboard "${newDashboard.name}" created successfully in "${selectedFolderObj?.name}" folder!`);
        }}
        closeDialog={() => {
          setShowCreateModal(false);
          setShowCreateFolder(false);
          setReportName('');
          setSelectedFolder('');
          setNewFolderName('');
          setDashboardNameError('');
          setFolderNameError('');
        }}
        customSaveChangesButtonName="Create Dashboard"
      >
        <div className="mb-3">
          <Form.Label className="fw-bold">Dashboard Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter dashboard name"
            value={reportName}
            onChange={(e) => {
              setReportName(e.target.value);
              setDashboardNameError('');
            }}
            isInvalid={!!dashboardNameError}
          />
          {dashboardNameError && (
            <Form.Control.Feedback type="invalid">
              {dashboardNameError}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="mb-3">
          <Form.Label className="fw-bold">Select Folder</Form.Label>
          <div className="d-flex gap-2">
            <Form.Select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="flex-grow-1"
            >
              <option value="">Choose a folder...</option>
              {dashboardFolders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </Form.Select>
            <BootstrapButton
              variant="outline-primary"
              onClick={() => {
                setShowCreateFolder(true);
                setNewFolderName('');
                setFolderNameError('');
              }}
              title="Create New Folder"
            >
              <FontAwesomeIcon icon={faFolder} className="me-1" />
              New Folder
            </BootstrapButton>
          </div>
        </div>

        {showCreateFolder && (
          <div className="mb-3 p-3 border rounded bg-light">
            <Form.Label className="fw-bold small">New Folder Name</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                  setFolderNameError('');
                }}
                isInvalid={!!folderNameError}
                size="sm"
              />
              <BootstrapButton
                variant="success"
                size="sm"
                onClick={() => {
                  if (!newFolderName.trim()) {
                    setFolderNameError('Folder name is required');
                    return;
                  }
                  
                  const isDuplicate = dashboardFolders.some(folder => 
                    folder.name.toLowerCase() === newFolderName.trim().toLowerCase()
                  );
                  
                  if (isDuplicate) {
                    setFolderNameError('Folder name already exists');
                    return;
                  }
                  
                  const newFolder = {
                    id: Date.now(),
                    name: newFolderName.trim(),
                    createdDate: new Date().toLocaleDateString()
                  };
                  
                  const updatedFolders = [...dashboardFolders, newFolder];
                  setDashboardFolders(updatedFolders);
                  localStorage.setItem('dashboardFolders', JSON.stringify(updatedFolders));
                  
                  setSelectedFolder(newFolder.id.toString());
                  setNewFolderName('');
                  setShowCreateFolder(false);
                  toast.success('Folder created successfully!');
                }}
              >
                Create
              </BootstrapButton>
              <BootstrapButton
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                  setFolderNameError('');
                }}
              >
                Cancel
              </BootstrapButton>
            </div>
            {folderNameError && (
              <div className="text-danger small mt-1">{folderNameError}</div>
            )}
          </div>
        )}
      </AddEditDialog>

      {/* Add Report Modal */}
      <AddReportModal
        dialogIsOpen={showAddReportModal}
        closeDialog={() => setShowAddReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default ReportingDashboard;
