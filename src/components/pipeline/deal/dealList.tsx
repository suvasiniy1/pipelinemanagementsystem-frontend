import { Title } from "@material-ui/icons";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Deal } from "../../../models/deal";
import { Stage } from "../../../models/stage";
import { DealAddEditDialog } from "./dealAddEditDialog";
import { DealItem } from "./dealItem";
import styled from '@xstyled/styled-components';
import { grid } from "../dnd/styles/constants";

type paramsForQuote = {
    deals: Array<Deal>
}

const InnerQuoteList = (props: paramsForQuote) => {
    const { deals, ...others } = props;
    return (
        <>
            {
                deals.map((deal, index) => (
                    <Draggable key={deal.dealID} draggableId={"" + deal.dealID as any} index={index}>
                        {(dragProvided, dragSnapshot) => (
                            <DealItem
                                key={deal.dealID}
                                deal={deal}
                                isDragging={dragSnapshot.isDragging}
                                isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                                provided={dragProvided}
                            />
                        )}
                    </Draggable>
                ))
            }
        </>

    )
}

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

function InnerList(props: { title?: any; deals?: Array<Deal>; dropProvided?: any; showAddButton: boolean, stageID?: number, onSaveChanges?: any }) {
    const { deals, dropProvided, showAddButton, stageID, ...others } = props;
    const title = props.title ? <Title>{props.title}</Title> : null;
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div>
            {title}
            <DropZone ref={dropProvided.innerRef}>
                <InnerQuoteList deals={deals ?? []}/>
                {dropProvided.placeholder}
            </DropZone>
            {
                dialogIsOpen && <DealAddEditDialog dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    onSaveChanges={(e: any) => props.onSaveChanges()}
                    index={stageID} />
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
    stageID?: any;
    listType?: any;
    style?: any;
    deals: Array<Deal>;
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
        stageID = 'LIST',
        listType,
        style,
        deals,
        title,
        useClone,
        onSaveChanges,
        ...others
    } = props;

    const [showAddButton, setShowAddButton] = useState(false);

    return (
        <div>
            <Droppable
                droppableId={stageID}
                type={listType}
                ignoreContainerClipping={ignoreContainerClipping}
                isDropDisabled={isDropDisabled}
                isCombineEnabled={isCombineEnabled}>
                {(dropProvided, dropSnapshot) => (
                    <InnerList deals={deals}
                        stageID={stageID}
                        title={title}
                        dropProvided={dropProvided}
                        showAddButton={showAddButton}
                        onSaveChanges={(e: any) => props.onSaveChanges()} />
                )}
            </Droppable>
        </div>
    );
}