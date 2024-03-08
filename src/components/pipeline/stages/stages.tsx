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
import { PipeLineService } from "../../../services/pipeLineService";
import { ErrorBoundary } from "react-error-boundary";
import { StageService } from "../../../services/stageService";

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
    const defaultStages = window?.config?.DefaultStages;
    const pipeLineSvc = new PipeLineService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    
    useEffect(() => {
        setIsLoading(true);
        if(pipeLineId){
            let pipeLinesList: Array<PipeLine> = JSON.parse(LocalStorageUtil.getItem(Constants.PIPE_LINES) as any);
            setSelectedItem(pipeLinesList.find(i => i.pipelineID == +pipeLineId));
        }
        else{
            if(defaultStages?.length>0){
                let newPipeLine = new PipeLine();
                newPipeLine.createdBy = "Developer";
                newPipeLine.createdDate = new Date();
                newPipeLine.pipelineName= newPipeLine.description = "New PipeLine";
                newPipeLine.stages = [];
                defaultStages.forEach((item, index)=>{
                    let obj = new Stage();
                    obj.stageOrder = index;
                    obj.stageName = item;
                    obj.probability = 100;
                    newPipeLine.stages.push(obj);
                });
                setSelectedItem(newPipeLine);
            }
        }

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
        alert("Operation not implemented yet");
        // pipeLineSvc.postItemBySubURL(selectedItem as any, 'SavePipelineDetails').then(res=>{
        //     debugger
        //     if(res.data){

        //     }
        // })
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
            <div className="rs-container maincontent" style={{width:"100%"}} hidden={isLoading}>
                <div className="rs-content maincontentinner">
                    {
                        <>
                            <StageActions onAddClick={addNewStage}
                                            onSaveClick={saveStages}
                                            onCancelClick={cancelChanges}
                                            selectedItem={selectedItem as any} />
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
                                                        onDeleteClick={(index: number) => alert("Delete operation not available")}
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
