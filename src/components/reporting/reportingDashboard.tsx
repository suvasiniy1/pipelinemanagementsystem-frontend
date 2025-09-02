import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Form, Modal } from "react-bootstrap";
import { Button } from "@mui/material";
import Filters from "./filters";
import Util from "../../others/util";
import CardContent from "./cardContent";
import CreateButton from "./CreateButton";
import AddReportModal from "./AddReportModal";
import ReportView from "./ReportView";
import { mockReports } from "../../data/mockReports";
import { ReportDefinition } from "../../models/reportModels";
import './reportingStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartBar, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

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
  const [createdReports, setCreatedReports] = useState<any[]>([]);
  const [createdDashboards, setCreatedDashboards] = useState<any[]>([]);
  const [activeNavItem, setActiveNavItem] = useState("My Dashboard");
  const [createType, setCreateType] = useState(""); // "Report" or "Dashboard"
  const [currentView, setCurrentView] = useState<'dashboard' | 'report'>('dashboard');
  const [currentReport, setCurrentReport] = useState<{entity: string, reportType: string, reportDefinition?: ReportDefinition} | null>(null);
  
  const reportTypes = ["Performance", "Conversion", "Duration", "Progress", "Products"];

  // Load saved reports from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('createdReports');
    const savedDashboards = localStorage.getItem('createdDashboards');
    if (savedReports) setCreatedReports(JSON.parse(savedReports));
    if (savedDashboards) setCreatedDashboards(JSON.parse(savedDashboards));
  }, []);

  const handleCreateSelect = (type: string) => {
    setCreateType(type);
    if (type === "report") {
      setShowAddReportModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handleCreate = () => {
    if (reportName && (createType === "dashboard" || reportType)) {
      const newItem = {
        id: Date.now(),
        name: reportName,
        type: createType === "dashboard" ? "Dashboard" : reportType,
        createdDate: new Date().toLocaleDateString()
      };
      
      if (createType === "dashboard") {
        const updatedDashboards = [...createdDashboards, newItem];
        setCreatedDashboards(updatedDashboards);
        localStorage.setItem('createdDashboards', JSON.stringify(updatedDashboards));
      } else {
        const updatedReports = [...createdReports, newItem];
        setCreatedReports(updatedReports);
        localStorage.setItem('createdReports', JSON.stringify(updatedReports));
      }
      
      setReportName("");
      setReportType("");
      setCreateType("");
      setShowCreateModal(false);
    }
  };

  const handleReportSubmit = (entity: string, reportType: string) => {
    const newReport = {
      id: Date.now(),
      name: `${entity} ${reportType} Report`,
      type: reportType,
      entity: entity,
      createdDate: new Date().toLocaleDateString()
    };
    
    const updatedReports = [...createdReports, newReport];
    setCreatedReports(updatedReports);
    localStorage.setItem('createdReports', JSON.stringify(updatedReports));
    
    // Navigate to report view
    setCurrentReport({ entity, reportType });
    setCurrentView('report');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentReport(null);
  };

  const handleReportClick = (report: any) => {
    const mockReport = mockReports.find(r => r.name.includes(report.type));
    setCurrentReport({ 
      entity: report.entity, 
      reportType: report.type,
      reportDefinition: mockReport
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
            color: '#b68d40'
          }}>
            <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '8px' }} />
            Dashboards
          </div>
          <div 
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: activeNavItem === 'My Dashboard' ? '#e4cb9a' : 'transparent',
              borderRadius: '4px',
              marginBottom: '5px'
            }}
            onClick={() => setActiveNavItem('My Dashboard')}
          >
            My Dashboard
          </div>
          {createdDashboards.map(dashboard => (
            <div 
              key={dashboard.id}
              style={{ 
                padding: '8px 16px', 
                cursor: 'pointer',
                backgroundColor: activeNavItem === dashboard.name ? '#e4cb9a' : 'transparent',
                borderRadius: '4px',
                marginBottom: '5px'
              }}
              onClick={() => setActiveNavItem(dashboard.name)}
            >
              {dashboard.name}
            </div>
          ))}
        </div>

        {/* Reports Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#b68d40'
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
                {report.name} ({report.type})
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

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New {createType.charAt(0).toUpperCase() + createType.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{createType.charAt(0).toUpperCase() + createType.slice(1)} Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter ${createType} name`}
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </Form.Group>
            {createType === "report" && (
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="">Select report type</option>
                  {reportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleCreate}
            disabled={!reportName || (createType === "report" && !reportType)}
            sx={{ backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}
          >
            Create {createType.charAt(0).toUpperCase() + createType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>

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
