import { Title } from "@material-ui/icons";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Deal } from "../../../models/deal";
import { Stage } from "../../../models/stage";
import { DealAddEditDialog } from "./dealAddEditDialog";
import { DealItem } from "./dealItem";
import styled from '@xstyled/styled-components';
import { grid } from "../dnd/styles/constants";

const InnerQuoteList = React.memo(function InnerQuoteList(props: any) {

    return props.quotes.map((quote: Stage, index: number) => (
        <Draggable key={quote.id} draggableId={"" + quote.id as any} index={index}>
            {(dragProvided, dragSnapshot) => (
                <DealItem
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

function InnerList(props: { title?: any; quotes?: any; dropProvided?: any; showAddButton: boolean, index?: number, onSaveChanges?: any }) {
    const { quotes, dropProvided, showAddButton, index, ...others } = props;
    const title = props.title ? <Title>{props.title}</Title> : null;
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div>
            {title}
            <DropZone ref={dropProvided.innerRef}>
                <InnerQuoteList quotes={quotes ?? []} />
                {dropProvided.placeholder}
            </DropZone>
            {
                dialogIsOpen && <DealAddEditDialog dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    onSaveChanges={(e: any) => props.onSaveChanges()}
                    index={index} />
            }
        </div>
    );
}

type params = {
    index?: number;
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
    onSaveChanges: any;
}

export const DealList = (props: params) => {
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
        <div>
            <Droppable
                droppableId={listId}
                type={listType}
                ignoreContainerClipping={ignoreContainerClipping}
                isDropDisabled={isDropDisabled}
                isCombineEnabled={isCombineEnabled}>
                {(dropProvided, dropSnapshot) => (
                    <InnerList quotes={quotes}
                        index={index}
                        title={title}
                        dropProvided={dropProvided}
                        showAddButton={showAddButton}
                        onSaveChanges={(e: any) => props.onSaveChanges()} />
                )}
            </Droppable>
        </div>
    );
}