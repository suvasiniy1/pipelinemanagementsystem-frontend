import React, { useState } from 'react';
import { AddEditDialog } from '../../../common/addEditDialog'; // Ensure correct path
import { DataGrid, GridColDef,GridPaginationModel  } from '@mui/x-data-grid';
import ProgressBar from 'react-bootstrap/ProgressBar';
import StagesProgressBar from "./stagesProgressBar";
import { Stage } from '../../../models/stage';


interface DealsDialogProps {
    show: boolean;
    onClose: () => void;
    dealsData: { id: number; treatmentName: string; personName: string; ownerName: string }[];
    stages: Stage[];
    currentStageId: number;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'treatmentName', headerName: 'Title', width: 200 },
    { field: 'personName', headerName: 'Contact Person', width: 200 },
    { field: 'ownerName', headerName: 'Owner', width: 200 },
    { field: 'Organization', headerName: 'Organization', width: 200 },
];

const DealsDialog: React.FC<DealsDialogProps> = ({ show, onClose, dealsData ,stages, currentStageId }) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
    return (
        <AddEditDialog dialogIsOpen={show} header="Linked Deals" closeDialog={onClose} showSaveButton={false}>
        <div style={{ marginBottom: '20px' }}>
          <h5>Open deals ({dealsData.length})</h5>
          <div>
            {dealsData.map((deal) => (
              <div key={deal.id} style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}>
                <div>
                  <strong>{deal.treatmentName}</strong>
                </div>
                <StagesProgressBar stages={stages} currentStageId={currentStageId} />
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
        />
    ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No data available</p>
    )}
        </div>
      </AddEditDialog>
    );
};

export default DealsDialog;
