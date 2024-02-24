import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './dnd/board/Board';
import { generateQuoteMap } from './dnd/mockData';
import { DashboardHeader } from './dashboardHeader';
import { useState } from 'react';
import { Stage } from '../../models/stage';


export const Dashboard = () => {

  const [rowData, setRowData] = useState<Array<Stage>>([]);

  const data = {
    medium: generateQuoteMap(5),
    large: generateQuoteMap(5),
  };

  return (
    <>
      <DashboardHeader canAddDeal={rowData.length > 0} />
      <Board initial={data.medium}/>
    </>
  );
}
