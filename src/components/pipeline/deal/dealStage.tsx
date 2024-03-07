import { colors } from "@atlaskit/theme";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DealList } from "./dealList";


type params = {
    title?: any;
    deals?: any;
    stageID?: any;
    isScrollable?: boolean;
    isCombineEnabled?: boolean;
    useClone?: boolean;
    onSaveChanges?: any;
}

export const DealStage = (props: params) => {
    const { title, deals, stageID, isScrollable, isCombineEnabled, useClone, ...others } = props;

    const [showAddButton, setShowAddButton] = useState(false);
    
    return (
        <div className="pdstage-col" onMouseEnter={e => { setShowAddButton(true); }} onMouseLeave={e => { setShowAddButton(false) }}>
            <div className="pdstage-innercol">
                <Draggable draggableId={"" + title} index={stageID} isDragDisabled={true}>
                    {(provided, snapshot) => (
                        <div>
                            <div className="pdstage-header">
                                <div className="pdstage-head">{title}</div>
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
                                onSaveChanges={(e: any) => props.onSaveChanges()}
                            />
                        </div>
                    )}
                </Draggable>
                <div id="addNewQuote" style={{ display: showAddButton ? 'block' : 'none' }}>
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>
        </div>

    );
};
