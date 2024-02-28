import React, { useState } from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import { grid, borderRadius } from "../styles/constants";
import { Draggable } from "react-beautiful-dnd";
import { QuoteList } from "../styles/list";
import Title from "../styles/title";

type params = {
  title: any;
  quotes: any;
  index: any;
  isScrollable: boolean;
  isCombineEnabled: boolean;
  useClone: boolean;
  onSaveChanges:any;
}

const Column = (props: params) => {
  const { title, quotes, index, isScrollable, isCombineEnabled, useClone, ...others } = props;


  const Container = styled.divBox`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

  const Header = styled.divBox`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${(isDragging: any) =>
      isDragging ? colors.G50 : colors.N30};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.G50};
  }
`;



  return (
    <div>
    <Draggable draggableId={""+title} index={index}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Header isDragging={snapshot.isDragging}>
            <Title
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
              aria-label={`${title} quote list`}
            >
              {title}
            </Title>
          </Header>
          <QuoteList
            index={index}
            listId={title}
            listType="QUOTE"
            style={{
              backgroundColor: snapshot.isDragging ? colors.G50 : null
            }}
            quotes={quotes}
            internalScroll={isScrollable}
            isCombineEnabled={isCombineEnabled}
            useClone={useClone}
            onSaveChanges={(e:any)=>props.onSaveChanges()}
          />
        </Container>
      )}
    </Draggable>
    </div>
  );
};

export default Column;
