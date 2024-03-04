/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import AddIcon from '@material-ui/icons/Add';
import styled from '@xstyled/styled-components';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { grid } from './constants';
import QuoteItem from './item';
import Title from './title';
import { Stage } from '../../../../models/stage';
import { Deal } from '../../../../models/deal';
import { DealAddEditDialog } from '../../deal/dealAddEditDialog';

export const getBackgroundColor = (isDraggingOver: any, isDraggingFrom: any) => {
  if (isDraggingOver) {
    return '#FFEBE6';
  }
  if (isDraggingFrom) {
    return '#E6FCFF';
  }
  return '#EBECF0';
};

const Wrapper = styled.divBox`
  background-color: ${(props: { isDraggingOver: any; isDraggingFrom: any; }) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${(isDropDisabled: boolean) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.divBox`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.divBox`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.divBox``;
/* stylelint-enable */

const InnerQuoteList = React.memo(function InnerQuoteList(props: any) {
  
  return props.quotes.map((quote:Stage, index: number) => (
    <Draggable key={quote.id} draggableId={""+quote.id as any} index={index}>
      {(dragProvided, dragSnapshot) => (
        <QuoteItem
          key={quote.id}
          quote={quote}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
        />
      )}
    </Draggable>
  ));
});



function InnerList(props: { title?: any; quotes?: any; dropProvided?: any; showAddButton:boolean, index?:number, onSaveChanges?:any }) {
  const { quotes, dropProvided, showAddButton, index, ...others } = props;
  const title = props.title ? <Title>{props.title}</Title> : null;
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <Container>
      {title}
      <DropZone ref={dropProvided.innerRef}>
        <InnerQuoteList quotes={quotes ?? []} />
        {dropProvided.placeholder}
        <div id="addNewQuote" onClick={(e:any)=>setDialogIsOpen(true)} style={{ width: 10, height: 10, padding: 100, paddingTop: 10, display: showAddButton ? 'block' : 'none' }}>
        <AddIcon style={{cursor:"pointer"}}/>
        </div>
      </DropZone>
      {
        dialogIsOpen && <DealAddEditDialog  dialogIsOpen={dialogIsOpen}
                                            setDialogIsOpen={setDialogIsOpen}
                                            onSaveChanges={(e: any) => props.onSaveChanges()}
                                            index={index} />
      }
    </Container>
  );
}

type params = {
  index?:number;
  ignoreContainerClipping?: any;
  internalScroll?: any;
  scrollContainerStyle?: any;
  isDropDisabled?: any;
  isCombineEnabled?: any;
  listId?: any;
  listType?: any;
  style?: any;
  quotes: Array<Deal>;
  title?: any;
  useClone?: any;
  onSaveChanges:any;
}

export const QuoteList = (props: params) => {
  const {
    index,
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    style,
    quotes,
    title,
    useClone, 
    onSaveChanges,
    ...others
  } = props;

  const [showAddButton, setShowAddButton] = useState(false);

  return (
    <div onMouseEnter={e => {setShowAddButton(true);}} onMouseLeave={e => {setShowAddButton(false)}}>
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, descriptor) => (
            <QuoteItem
              quote={quotes}
              provided={provided}
              isDragging={snapshot.isDragging}
              isClone
            />
          )
          : null as any
      }
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <InnerList  quotes={quotes} 
                          index={index}
                          title={title} 
                          dropProvided={dropProvided}  
                          showAddButton={showAddButton}
                          onSaveChanges={(e:any)=>props.onSaveChanges()}/>
            </ScrollContainer>
          ) : (
              <InnerList  quotes={quotes} 
                          index={index}
                          title={title} 
                          dropProvided={dropProvided} 
                          showAddButton={showAddButton}
                          onSaveChanges={(e:any)=>props.onSaveChanges()}/>
            )}
        </Wrapper>
      )}
    </Droppable>
    </div>
  );
}
