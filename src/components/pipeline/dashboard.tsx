import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './dnd/board/Board';
import { generateQuoteMap } from './dnd/mockData';
import { DashboardHeader } from './dashboardHeader';
import { useState } from 'react';
import { Stage } from '../../models/stage';


export const Dashboard = () => {

  const [rowData, setRowData] = useState<Array<Stage>>(JSON.parse(localStorage.getItem("stagesList") as any) ?? []);

  const data = {
    medium: generateQuoteMap(5),
    large: generateQuoteMap(5),
  };

  const updateRowData = () => {
    
    setRowData(JSON.parse(localStorage.getItem("stagesList") as any) ?? []);
  }

  return (
    <>
      <DashboardHeader canAddDeal={rowData.length > 0} onSaveChanges={(e: any) => updateRowData()} />
      <Board initial={data.medium} rowData={rowData} onSaveChanges={(e: any) => updateRowData()}/>
    </>
  );
}
