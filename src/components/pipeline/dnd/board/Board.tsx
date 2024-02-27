// @flow
import React, { useEffect, useState } from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import PropTypes from "prop-types";
import Column from "./Column";
import reorder, { reorderQuoteMap } from "../reorder";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Stage } from "../../../../models/stage";
import { Deal } from "../../../../models/deal";

type params = {
  isCombineEnabled?: any,
  initial?: any,
  useClone?: any,
  containerHeight?: any,
  withScrollableColumns?: any,
  rowData:Array<Stage>;

}

export const Board = (props: params) => {
  const { isCombineEnabled, initial, useClone, containerHeight, withScrollableColumns, rowData, ...others } = props;
  const [columns, setColumns] = useState(initial);
  
  const [stages, setStages]=useState<Array<Stage>>(rowData ?? []);
  const [ordered, setOrdered] = useState(Object.keys(initial));

  useEffect(() => {
    
    let stages: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
    stages.forEach((s, index) => {
      s.deals.forEach((d, dIndex) => {
        d.id = `G${index + dIndex}`;
      })
    })
    setStages(stages);
  }, [props.rowData])

  const reorderQuoteMap = (quoteMap: Array<Stage>, source: any, destination: any) => {
    
    const sourceIndex = quoteMap.findIndex(q=>q.name==source.droppableId);
    const destinationIndex = quoteMap.findIndex(q=>q.name==destination.droppableId);
    const orderIndex = destination.index;
    
    let item = quoteMap[sourceIndex].deals[source.index];
    item.pipeLineId = quoteMap[sourceIndex].id;
    quoteMap[sourceIndex].deals.splice(source.index, 1);
    quoteMap[destinationIndex].deals.splice(orderIndex, 0, item);
  
    return quoteMap;
  };

  const onDragEnd = (result: any) => {
    
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow = [...ordered];
        shallow.splice(result.source.index, 1);
        setOrdered(shallow);
        return;
      }

      const column = columns[result.source.droppableId];
      const withQuoteRemoved = [...column];

      withQuoteRemoved.splice(result.source.index, 1);

      const orderedColumns = {
        ...columns,
        [result.source.droppableId]: withQuoteRemoved
      };
      setColumns(orderedColumns);
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const reorderedorder = reorder(ordered, source.index, destination.index);

      setOrdered(reorderedorder as any);

      return;
    }

    
    const data = reorderQuoteMap(
      stages,
      source,
      destination
    ) as any;

    localStorage.setItem("stagesList", JSON.stringify([...data]));
    setStages([...data]);
  };

  const Container = styled.divBox`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

  return (
    <>
      <div hidden={stages.length == 0}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
            ignoreContainerClipping={Boolean(containerHeight)}
            isCombineEnabled={isCombineEnabled}
          >
            {(provided) => (
              <Container ref={provided.innerRef} {...provided.droppableProps}>
                {stages?.map((item, index) => (
                  <Column
                    key={index}
                    index={index}
                    title={item.name}
                    quotes={item.deals}
                    isScrollable={withScrollableColumns}
                    isCombineEnabled={isCombineEnabled}
                    useClone={useClone}
                  />
                ))}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div hidden={stages.length > 0} style={{alignItems:"center"}}>
        <br/>
        No stages are available, please create one to add deals.
      </div>
    </>
  );
};

Board.defaultProps = {
  isCombineEnabled: false
};

Board.propTypes = {
  isCombineEnabled: PropTypes.bool
};

export default Board;
