import { Stage } from "../../../models/stage";

// a little function to help us with reordering the result
export const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

// export const reorderQuoteMap = (quoteMap: Array<Stage>, source: any, destination: any) => {
  
//   const sourceIndex = quoteMap.findIndex(q=>q.title==source.droppableId);
//   const destinationIndex = quoteMap.findIndex(q=>q.title==destination.droppableId);
//   const current = [...quoteMap[sourceIndex]?.deals as any];
//   const next = [...quoteMap[destinationIndex]?.deals as any];
//   const target = current[source.index];

//   // moving to same list
//   if (sourceIndex === destinationIndex) {
//     const reordered = reorder(current, sourceIndex, destinationIndex);
//     const result = {
//       ...quoteMap,
//       [sourceIndex]: reordered
//     };
//     return {
//       quoteMap: result
//     };
//   }

//   // moving to different list

//   // remove from original
//   current.splice(sourceIndex, 1);
//   // insert into next
//   next.splice(destinationIndex, 0, target);

//   const result = {
//     ...quoteMap,
//     [sourceIndex]: current,
//     [destinationIndex]: next
//   };

//   return result;
// };

export const moveBetween = (list1: any, list2: any, source: any, destination: any) => {
  const newFirst = Array.from(list1.values);
  const newSecond = Array.from(list2.values);

  const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
  const moveTo = moveFrom === newFirst ? newSecond : newFirst;

  const [moved] = moveFrom.splice(source.index, 1);
  moveTo.splice(destination.index, 0, moved);

  return {
    list1: {
      ...list1,
      values: newFirst
    },
    list2: {
      ...list2,
      values: newSecond
    }
  };
}
