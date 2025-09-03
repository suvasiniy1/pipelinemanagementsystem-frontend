import React, { useState } from 'react';
import { AddEditDialog } from '../../../common/addEditDialog'; // Ensure correct path
import { DataGrid, GridColDef,GridPaginationModel  } from '@mui/x-data-grid';
import ProgressBar from 'react-bootstrap/ProgressBar';
import StagesProgressBar from "./stagesProgressBar";
import { Stage } from '../../../models/stage';


interface DealsDialogProps {
    show: boolean;
    onClose: () => void;
    dealsData: {
      pipelineStages: Stage[];
      pipelineName: string;
      stageID: number; id: number; treatmentName: string; personName: string; ownerName: string 
}[];
    stages: Stage[];
    currentStageId: number;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'treatmentName', headerName: 'Title', width: 200 },
    { field: 'personName', headerName: 'Contact Person', width: 200 },
    { field: 'ownerName', headerName: 'Owner', width: 200 },
    { field: 'organizationName', headerName: 'Organization', width: 200 },
];
const portalContainer =
  typeof document !== 'undefined' ? () => document.body : undefined;
const DealsDialog: React.FC<DealsDialogProps> = ({ show, onClose, dealsData ,stages, currentStageId }) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
    return (
        <AddEditDialog dialogIsOpen={show} header="Linked Deals" closeDialog={onClose} showSaveButton={false}>
       <div style={{ marginBottom: '20px' }}>
  <h5>Open deals ({dealsData.length})</h5>
  <div>
    {dealsData.map((deal) => (
      <div
        key={deal.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <div>
          <strong>{deal.treatmentName}</strong>
          <div style={{ fontSize: '0.85em', color: '#666' }}>
            Pipeline: <em>{deal.pipelineName || 'N/A'}</em>
          </div>
        </div>
        <StagesProgressBar
          stages={deal.pipelineStages}
          currentStageId={deal.stageID}
        />
      </div>
    ))}
  </div>
</div>
  
        <div style={{ height: 400, width: '100%' }}>
        {dealsData.length > 0 ? (
        <DataGrid
            className="custom-data-grid"
            rows={dealsData}
            columns={columns}
            getRowId={(row) => row.id}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            slotProps={{
    // Column menu + filter/columns panels
    basePopper: {
      disablePortal: false,            // force rendering into a portal
      container: portalContainer,      // portal target → <body>
      placement: 'bottom-start',
      modifiers: [
        { name: 'offset', options: { offset: [0, 6] } },
        { name: 'flip', options: { fallbackPlacements: ['top-start'] } },
        { name: 'preventOverflow', options: { rootBoundary: 'viewport', padding: 8 } },
      ],
    },

    // you already have this part for the page-size dropdown
    pagination: {
      SelectProps: {
        MenuProps: {
          container: portalContainer,
          disablePortal: false,
          disableScrollLock: true,
          PaperProps: { sx: { maxHeight: 280, overflowY: 'auto' } },
        },
      },
    },
  }}
  sx={{
    // safety net in case the grid version ignores container
    '& .MuiDataGrid-menu, & .MuiDataGrid-panel': { zIndex: 20000 },
  }}
        />
    ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No data available</p>
    )}
        </div>
      </AddEditDialog>
    );
};

export default DealsDialog;
