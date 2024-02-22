import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './dnd/board/Board';
import { generateQuoteMap } from './dnd/mockData';


export const Dashboard = () => {
  const data = {
    medium: generateQuoteMap(5),
    large: generateQuoteMap(5),
  };
  console.log(data.medium, 'data.medium');
  return (
    <>
      <Board initial={data.medium} />
    </>
  );
}
