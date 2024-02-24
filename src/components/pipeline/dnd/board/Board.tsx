// @flow
import React, { useState } from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import PropTypes from "prop-types";
import Column from "./Column";
import reorder, { reorderQuoteMap } from "../reorder";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Stage } from "../../../../models/stage";

type params = {
  isCombineEnabled?: any,
  initial?: any,
  useClone?: any,
  containerHeight?: any,
  withScrollableColumns?: any,

}

export const Board = (props: params) => {
  const { isCombineEnabled, initial, useClone, containerHeight, withScrollableColumns, ...others } = props;
  const [columns, setColumns] = useState(initial);
  
  const stages: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
  const [ordered, setOrdered] = useState(Object.keys(initial));

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
      columns,
      source,
      destination
    );

    setColumns(data.quoteMap);
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
                    title={item.title}
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
