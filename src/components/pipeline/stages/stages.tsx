// @flow
import styled from "@xstyled/styled-components";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DeleteDialog } from "../../../common/deleteDialog";
import { Stage } from "../../../models/stage";
import { generateQuoteMap } from "../dnd/mockData";
import reorder from "../dnd/reorder";
import { StageActions } from "./stageActions";
import { StageContainer } from "./stageContainer";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import { PipeLine } from "../../../models/pipeline";
import { AddNewStage } from "./addNewStage";

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
    const [selectedItem, setSelectedItem] = useState<PipeLine>();
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipelineID") as any);

    useEffect(() => {
        setIsLoading(true);
        let pipeLinesList: Array<PipeLine> = JSON.parse(LocalStorageUtil.getItem(Constants.PIPE_LINES) as any);
        setSelectedItem(pipeLinesList.find(i => i.pipelineID == +pipeLineId));
        setIsLoading(false);
    }, [pipeLineId])

    useEffect(() => {
        setStages(selectedItem?.stages as Array<Stage>);
    }, [selectedItem])

    const createNewStageObject = () => {
        let obj = new Stage();
        obj.stageOrder = (selectedItem?.stages as Array<Stage>)?.length + 1;
        obj.stageName = "New Stage" + (selectedItem?.stages as Array<Stage>)?.length + 1;
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
            let sourceIndex = stages.findIndex(s=>s.stageOrder==source.index);
            let destinationIndex = stages.findIndex(s=>s.stageOrder==destination.index);
            const reorderedorder = reorder([...stages], source.index, destination.index);

            setStages([...reorderedorder as any]);

            return;
        }

        // const data = reorderQuoteMap(
        //     columns,
        //     source,
        //     destination
        // );

        // setStages(data as any);
    };

    const addNewStage = (index?:number) => {
        
        let stagesList = stages;
        if(index) stagesList.splice(index == -1 ? 0 : index, 0, createNewStageObject());
        else stagesList.push(createNewStageObject());
        
        setStages([...stagesList]);
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

    const Container = styled.divBox`
  `;

    return (
        <>
            <Spinner hidden={!isLoading} className="spinner" />
            <div className="rs-container maincontent" hidden={isLoading}>
                <div className="rs-content maincontentinner">
                    {
                        <>
                            <StageActions onAddClick={addNewStage}
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
                    <div className="pdstage-area">
                        <div className="container-fluid">
                            
                            <div className="editstage-row scrollable-stages-container">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable
                                        droppableId="board"
                                        type="COLUMN"
                                        direction="horizontal"
                                    >
                                        {(provided) => (
                                            <>
                                             <div ref={provided.innerRef} {...provided.droppableProps} style={{display:"flex"}}>
                                                {stages?.map((item, index) => (
                                                    <StageContainer
                                                        key={index}
                                                        index={index}
                                                        title={item?.stageName}
                                                        selectedItem={item}
                                                        onAddClick={(e:any)=>addNewStage(e)}
                                                        onDeleteClick={(index: number) => { setSelectedItemIndex(index); setShowDeleteDialog(true); }}
                                                    />
                                                ))}

                                                {provided.placeholder}
                                                </div>
                                            </>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <AddNewStage  onAddClick={addNewStage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Stages;
