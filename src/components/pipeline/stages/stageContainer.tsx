import { colors } from "@atlaskit/theme";
import styled from "@xstyled/styled-components";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { borderRadius } from "../dnd/styles/constants";
import { StageItem } from "./stageItem";

type params = {
    title: any,
    index: any,
    selectedItem: Stage;
    setSelectedItem:any;
    onDeleteClick: any;
    onAddClick:any;
}
export const StageContainer = (props: params) => {
    
    const { title, index, selectedItem, setSelectedItem, onDeleteClick, ...others } = props;
    const [opacity, setOpacity] = useState();

    return (
        <>
            <Draggable draggableId={""+index} index={index}>
                {(provided, snapshot) => (
                    <div className="editstage-col"
                        ref={provided.innerRef} {...provided.draggableProps}>

                        <StageItem  selectedItem={selectedItem} 
                                    setSelectedItem={setSelectedItem} 
                                    provided={provided}
                                    onAddClick={(e:any)=>props.onAddClick(e==="left" ? index-1 : index+1)}
                                    onDeleteClick={(e:any)=>props.onDeleteClick(selectedItem.stageID)}
                                    />
                        
                    </div>
                )}
            </Draggable>
        </>
    )
}