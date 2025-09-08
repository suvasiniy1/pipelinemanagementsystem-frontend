import { faChartBar, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../common/deleteDialog';
import DashboardReportChart from './DashboardReportChart';

interface DashboardViewProps {
  dashboard: any;
  onBack: () => void;
  onReportClick: (report: any) => void;
  onDashboardUpdate: (updatedDashboard: any) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ dashboard, onBack, onReportClick, onDashboardUpdate }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [reportToRemove, setReportToRemove] = useState<any>(null);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  
  // Get all saved reports from localStorage
  const allReports = JSON.parse(localStorage.getItem('createdReports') || '[]');
  
  // Filter reports that are mapped to this dashboard
  const mappedReports = dashboard.reports || [];
  const reports = allReports.filter((report: any) => 
    mappedReports.some((mapped: any) => mapped.id === report.id)
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button 
            variant="link" 
            onClick={onBack} 
            className="p-0 me-3 text-decoration-none"
            style={{ 
              color: '#6c757d',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back
          </Button>
          <h4 className="mb-0" style={{ 
            color: '#1f2937',
            fontWeight: '600',
            fontSize: '24px'
          }}>
            {dashboard.name}
          </h4>
        </div>
        <div className="text-muted small">
          Folder: {dashboard.folderName} | Created: {dashboard.createdDate}
        </div>
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div className="row g-4">
          {reports.map((report: any) => (
            <div key={report.id} className="col-lg-6">
              <div className="position-relative">
                <DashboardReportChart report={report} />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="position-absolute"
                  style={{
                    top: '8px',
                    right: '8px',
                    zIndex: 10,
                    padding: '4px 8px',
                    fontSize: '12px'
                  }}
                  onClick={() => {
                    setReportToRemove(report);
                    setShowRemoveModal(true);
                  }}
                  title="Remove from dashboard"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <FontAwesomeIcon 
            icon={faChartBar} 
            size="3x" 
            className="mb-3 text-muted" 
          />
          <h5 className="text-muted mb-3">No Reports Available</h5>
          <p className="text-muted">
            No reports are currently mapped to this dashboard.
          </p>
          <Button 
            variant="primary" 
            onClick={() => setShowAddReportModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Report
          </Button>
        </div>
      )}
      
      {/* Remove Report Confirmation Dialog */}
      {showRemoveModal && reportToRemove && (
        <DeleteDialog
          itemType="Report"
          itemName={reportToRemove.name}
          dialogIsOpen={showRemoveModal}
          closeDialog={() => {
            setShowRemoveModal(false);
            setReportToRemove(null);
          }}
          onConfirm={() => {
            // Remove report from dashboard
            const updatedReports = dashboard.reports.filter((r: any) => r.id !== reportToRemove.id);
            const updatedDashboard = { ...dashboard, reports: updatedReports };
            
            // Update localStorage
            const savedDashboards = JSON.parse(localStorage.getItem('createdDashboards') || '[]');
            const updatedDashboards = savedDashboards.map((d: any) => 
              d.id === dashboard.id ? updatedDashboard : d
            );
            localStorage.setItem('createdDashboards', JSON.stringify(updatedDashboards));
            
            toast.success(`Report "${reportToRemove.name}" removed from dashboard!`);
            setShowRemoveModal(false);
            setReportToRemove(null);
            
            // Update parent component with new dashboard data
            onDashboardUpdate(updatedDashboard);
          }}
          customDeleteMessage={<div>Are you sure you want to remove <strong>{reportToRemove.name}</strong> from this dashboard?</div>}
          isPromptOnly={false}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          actionType="Remove"
        />
      )}
      
      {/* Add Report to Dashboard Modal */}
      {showAddReportModal && (
        <DeleteDialog
          itemType="Report"
          itemName=""
          dialogIsOpen={showAddReportModal}
          closeDialog={() => setShowAddReportModal(false)}
          onConfirm={() => {}}
          customDeleteMessage={
            <div>
              <h6 className="mb-3">Select Reports to Add</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {JSON.parse(localStorage.getItem('createdReports') || '[]')
                  .filter((report: any) => 
                    !dashboard.reports?.some((dashReport: any) => dashReport.id === report.id)
                  )
                  .map((report: any) => (
                    <div 
                      key={report.id}
                      className="d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                      style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                      onClick={() => {
                        const reportToAdd = {
                          id: report.id,
                          name: report.name,
                          type: report.type,
                          entity: report.entity
                        };
                        
                        const updatedDashboard = {
                          ...dashboard,
                          reports: [...(dashboard.reports || []), reportToAdd]
                        };
                        
                        const savedDashboards = JSON.parse(localStorage.getItem('createdDashboards') || '[]');
                        const updatedDashboards = savedDashboards.map((d: any) => 
                          d.id === dashboard.id ? updatedDashboard : d
                        );
                        localStorage.setItem('createdDashboards', JSON.stringify(updatedDashboards));
                        
                        onDashboardUpdate(updatedDashboard);
                        toast.success(`Report "${report.name}" added to dashboard!`);
                        setShowAddReportModal(false);
                      }}
                    >
                      <div>
                        <div className="fw-bold">{report.name}</div>
                        <small className="text-muted">{report.entity} {report.type}</small>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  ))
                }
                {JSON.parse(localStorage.getItem('createdReports') || '[]')
                  .filter((report: any) => 
                    !dashboard.reports?.some((dashReport: any) => dashReport.id === report.id)
                  ).length === 0 && (
                  <div className="text-center text-muted py-3">
                    No available reports to add
                  </div>
                )}
              </div>
            </div>
          }
          isPromptOnly={true}
          confirmLabel="Close"
          cancelLabel=""
          actionType="Close"
        />
      )}
    </div>
  );
};

export default DashboardView;