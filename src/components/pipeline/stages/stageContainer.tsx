import { colors } from "@atlaskit/theme";
import styled from "@xstyled/styled-components";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { borderRadius, grid } from "../dnd/styles/constants";
import Title from "../dnd/styles/title";
import { StageItem } from "./stageItem";
import DeleteIcon from '@material-ui/icons/Delete';

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

    const Container = styled.divBox`
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
        <>
            <Draggable draggableId={""+index} index={index}>
                {(provided, snapshot) => (
                    <div className="editstage-col" ref={provided.innerRef} {...provided.draggableProps}>

                        <StageItem  selectedItem={selectedItem}  
                                    provided={provided}
                                    onAddClick={(e:any)=>props.onAddClick(e==="left" ? index-1 : index+1)}
                                    />
                        
                    </div>
                )}
            </Draggable>
        </>
    )
}