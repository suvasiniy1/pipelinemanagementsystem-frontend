// @flow
import styled from "@xstyled/styled-components";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { generateQuoteMap } from "../dnd/mockData";
import reorder, { reorderQuoteMap } from "../dnd/reorder";
import { StageContainer } from "./stageContainer";
import { AddNewStage } from "./addNewStage";
import { useNavigate } from "react-router-dom";

type params = {
    isCombineEnabled?: any,
    initial?: any,
    useClone?: any,
    containerHeight?: any,
    withScrollableColumns?: any,
    stages: Array<Stage>

}

export const Stages = (props: params) => {
    
    const data = {
        medium: generateQuoteMap(5),
        large: generateQuoteMap(5),
    };
    const { isCombineEnabled, initial, useClone, containerHeight, withScrollableColumns, ...others } = props;
    const [columns, setColumns] = useState(data.medium as any);
    const [ordered, setOrdered] = useState(Object.keys(data.medium));
    const [stages, setStages] = useState<Array<Stage>>(props.stages);
    const [originalsStages, setOriginalStages] = useState<Array<Stage>>(props.stages);
    const navigator = useNavigate();

    useEffect(() => {
            
            let listFromLocal:Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
            setStages(listFromLocal?.length == 0 ? [createNewStageObject(listFromLocal)] : listFromLocal)
    }, [])

    const createNewStageObject = (stages:Array<Stage>) => {
        let obj = new Stage();
        obj.order = stages?.length + 1;
        obj.title = "Test" + (stages?.length + 1);
        return obj;
    }

    const onDragEnd = (result: any) => {
        
        if (result.combine) {
            if (result.type === "COLUMN") {
                const shallow = [...ordered];
                shallow.splice(result.source.index, 1);
                setOrdered(shallow);
                return;
            }

            const column = columns[result.source.droppableId];
            const withQuoteRemoved = [...column];

            withQuoteRemoved.splice(result.source.index, 1);

            const orderedColumns = {
                ...columns,
                [result.source.droppableId]: withQuoteRemoved
            };
            setColumns(orderedColumns);
            return;
        }

        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // reordering column
        if (result.type === "COLUMN") {
            const reorderedorder = reorder([...stages], source.index, destination.index);

            setStages(reorderedorder as any);

            return;
        }

        const data = reorderQuoteMap(
            columns,
            source,
            destination
        );

        setColumns(data.quoteMap);
    };

    const Container = styled.divBox`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

    const addNewStage = () => {
        let stagesList = [...stages];
        stagesList.push(createNewStageObject(stagesList));
        setStages(stagesList);
    }

    const saveStages=()=>{
        localStorage.setItem("stagesList", JSON.stringify(stages));
        navigator("/pipeline");
    }

    const cancelChanges=()=>{
        navigator("/pipeline");
    }

    return (
        <>
            <div>
                {
                    <AddNewStage    onAddClick={addNewStage}
                                    onSaveClick={saveStages}
                                    onCancelClick={cancelChanges} />
                }
            </div>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId="board1"
                        type="COLUMN"
                        direction="horizontal"
                    >
                        {(provided) => (
                            <Container ref={provided.innerRef} {...provided.droppableProps}>
                                {stages.map((item, index) => (
                                    <StageContainer
                                        key={index}
                                        index={index}
                                        title={item.title}
                                        selectedItem={item}
                                    />
                                ))}
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>


        </>
    );
};

export default Stages;
