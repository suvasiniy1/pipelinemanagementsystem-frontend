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
    selectedItem: Stage
    onDeleteClick: any;
    onAddClick:any
}
export const StageContainer = (props: params) => {
    
    const { title, index, selectedItem, onDeleteClick, ...others } = props;
    const [opacity, setOpacity] = useState();

    const deleteStage = (index: number) => {
        props.onDeleteClick(index);
    }

    return (
        <>
            <Draggable draggableId={""+index} index={index}>
                {(provided, snapshot) => (
                    <div className="editstage-col"
                        ref={provided.innerRef} {...provided.draggableProps}
                        onMouseEnter={(e: any) => { setOpacity('inherit' as any) }}
                        onMouseLeave={(e: any) => { setOpacity(0.5 as any) }}>

                        <StageItem  selectedItem={selectedItem}  
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