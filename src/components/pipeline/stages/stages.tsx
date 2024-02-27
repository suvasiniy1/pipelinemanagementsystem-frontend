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
import { DeleteDialog } from "../../../common/deleteDialog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "react-bootstrap";

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        let listFromLocal: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
        setStages(listFromLocal?.length == 0 ? [createNewStageObject(listFromLocal)] : listFromLocal)
    }, [])

    const createNewStageObject = (stages: Array<Stage>) => {
        let obj = new Stage();
        obj.order = stages?.length + 1;
        obj.name = "Stage" + (stages?.length + 1);
        obj.id = stages?.length + 1;
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

        setStages(data as any);
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

    const saveStages = () => {
        localStorage.setItem("stagesList", JSON.stringify(stages));
        toast.success("Stages saved successfuly");
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigator("/pipeline");
        }, 1000);
    }

    const cancelChanges = () => {
        navigator("/pipeline");
    }

    const deleteStage = () => {
        let stagesList = [...stages];
        stagesList.splice(selectedItemIndex, 1);
        setStages(stagesList);
        localStorage.setItem("stagesList", JSON.stringify(stagesList));
        setShowDeleteDialog(false);
        toast.success("Stage deleted successfuly");
    }

    return (
        <>
            <Spinner hidden={!isLoading} className="spinner" />
            <div hidden={isLoading}>
                {
                    <>
                        <AddNewStage onAddClick={addNewStage}
                            onSaveClick={saveStages}
                            onCancelClick={cancelChanges} />
                        {showDeleteDialog &&
                            <DeleteDialog itemType={"Stage"}
                                itemName={""}
                                dialogIsOpen={showDeleteDialog}
                                closeDialog={(e: any) => setShowDeleteDialog(false)}
                                onConfirm={(e: any) => deleteStage()}
                                isPromptOnly={false}
                                actionType={"Delete"}
                            />
                        }
                    </>
                }
            </div>
            <div hidden={isLoading}>
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
                                        title={item.name}
                                        selectedItem={item}
                                        onDeleteClick={(index: number) => { setSelectedItemIndex(index); setShowDeleteDialog(true); }}
                                    />
                                ))}
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <ToastContainer />
        </>
    );
};

export default Stages;
