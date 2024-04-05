import { colors } from "@atlaskit/theme";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DealList } from "./dealList";
import { PipeLine } from "../../../models/pipeline";


type params = {
    title?: any;
    deals?: any;
    stageID?: any;
    isScrollable?: boolean;
    isCombineEnabled?: boolean;
    useClone?: boolean;
    onSaveChanges?: any;
    providedFromParent?:any;
    isDragging:any;
    pipeLinesList:Array<PipeLine>;
    onStageExpand:any
}

export const DealStage = (props: params) => {
    const { onStageExpand, title, deals, stageID, isScrollable, isCombineEnabled, useClone, providedFromParent, isDragging, pipeLinesList, ...others } = props;

    const [showAddButton, setShowAddButton] = useState(false);
    
    return (
        <div className="pdstage-col" 
        onMouseEnter={e => { setShowAddButton(true); }} 
        onMouseLeave={e => { setShowAddButton(false) }}
        {...providedFromParent.droppableProps}>
            <div className="pdstage-innercol">
                <Draggable draggableId={"" + title} index={stageID} isDragDisabled={true}>
                    {(provided, snapshot) => (
                        <div {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div className="pdstage-header">
                                <div className="pdstage-head">
                                    <div className="pdstagehead-title">{title}</div>
                                    <div className="pdstagehead-btns">
                                        <button className=''><i className="rs-icon rs-icon-plus"></i></button>
                                        <button className='' onClick={(e:any)=>onStageExpand(stageID)}><i className="rs-icon rs-icon-arrow-right"></i></button>
                                    </div>
                                </div>
                                <div className="pdstage-summary">
                                    <div className="pdstage-value">
                                        <span className='pdstage-price'>£0</span><span className='pdstage-num'>{deals.length} deals</span>
                                    </div>
                                </div>
                            </div>
                            <DealList
                                index={stageID}
                                stageID={stageID}
                                listType="Deal"
                                style={{
                                    backgroundColor: snapshot.isDragging ? colors.G50 : null
                                }}
                                deals={deals}
                                internalScroll={isScrollable}
                                isCombineEnabled={isCombineEnabled}
                                useClone={useClone}
                                isDragging={isDragging}
                                pipeLinesList={pipeLinesList}
                                onSaveChanges={(e: any) => props.onSaveChanges()}
                            />
                        </div>
                    )}
                </Draggable>
                {/* <div id="addNewQuote" style={{ display: showAddButton ? 'block' : 'none' }}>
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div> */}
            </div>
        </div>

    );
};
