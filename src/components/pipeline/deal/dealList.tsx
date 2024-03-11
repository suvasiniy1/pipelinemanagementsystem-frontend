import { Title } from "@material-ui/icons";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Deal } from "../../../models/deal";
import { Stage } from "../../../models/stage";
import { DealAddEditDialog } from "./dealAddEditDialog";
import { DealItem } from "./dealItem";
import styled from '@xstyled/styled-components';
import { grid } from "../dnd/styles/constants";
import Util from "../../../others/util";

type paramsForQuote = {
    deals: Array<Deal>;
    isDragging:boolean
}

const InnerQuoteList = (props: paramsForQuote) => {
    const { deals, isDragging, ...others } = props;
    return (
        <>
            {
                deals.map((deal, index) => (
                    <Draggable key={deal.dealID}  draggableId={"" + deal.dealID as any} index={deal.dealID} disableInteractiveElementBlocking={true}>
                        {(dragProvided, dragSnapshot) => (
                            <DealItem
                                key={deal.dealID}
                                deal={deal}
                                isGroupedOver={false}
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

function InnerList(props: { title?: any; deals?: Array<Deal>; dropProvided?: any; showAddButton: boolean, stageID?: number, onSaveChanges?: any, isDragging?:any }) {
    const { deals, dropProvided, showAddButton, stageID, isDragging, ...others } = props;
    const title = props.title ? <Title>{props.title}</Title> : null;
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div>
            {title}
            <DropZone ref={dropProvided.innerRef}>
                <InnerQuoteList deals={deals ?? []} isDragging={isDragging}/>
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
    isDragging:any
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
        isDragging,
        ...others
    } = props;

    const [showAddButton, setShowAddButton] = useState(false);

    return (
        <div>
            <Droppable
                droppableId={""+stageID}
                type={listType}
                ignoreContainerClipping={true}
                isDropDisabled={false}
                isCombineEnabled={false}>
                {(dropProvided, dropSnapshot) => (
                    <InnerList deals={deals}
                        stageID={stageID}
                        title={title}
                        isDragging={isDragging}
                        dropProvided={dropProvided}
                        showAddButton={showAddButton}
                        onSaveChanges={(e: any) => props.onSaveChanges()} />
                )}
            </Droppable>
        </div>
    );
}