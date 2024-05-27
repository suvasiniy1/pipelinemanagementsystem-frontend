// @flow
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DeleteDialog } from "../../../common/deleteDialog";
import { PipeLine } from "../../../models/pipeline";
import { Stage } from "../../../models/stage";
import { UserProfile } from "../../../models/userProfile";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import Util from "../../../others/util";
import { PipeLineService } from "../../../services/pipeLineService";
import { StageService } from "../../../services/stageService";
import { generateQuoteMap } from "../dnd/mockData";
import reorder from "../dnd/reorder";
import { AddNewStage } from "./addNewStage";
import { StageActions } from "./stageActions";
import { StageContainer } from "./stageContainer";

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
    const [stages, setStages] = useState<Array<Stage>>([]);
    const [originalsStages, setOriginalStages] = useState<Array<Stage>>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PipeLine>();
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipelineID") as any);
    const defaultStages = ["Qualified", "Conact Made", "Demo Scheduled", "Proposal Made", "Negotiations Started"];
    const pipeLineSvc = new PipeLineService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    const [error, setError] = useState<AxiosError>();
    const userProfile: UserProfile = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as any;
    const [canSave, setCanSave] = useState(false);
    const navigator = useNavigate();

    useEffect(() => {
        
        setIsLoading(true);
        if (pipeLineId) {
            
            loadStages(pipeLineId);
            let pipeLineItem = LocalStorageUtil.getItemObject(Constants.PIPE_LINE) as any;
            setSelectedItem(pipeLineItem);
        }
        else {
            if (defaultStages?.length > 0) {
                let newPipeLine = new PipeLine();
                newPipeLine.pipelineID = 0;
                newPipeLine.createdBy = userProfile.userId;
                newPipeLine.createdDate = new Date();
                newPipeLine.pipelineName = newPipeLine.description = "New PipeLine";
                newPipeLine.stages = [];
                defaultStages.forEach((item, index) => {
                    let obj = new Stage();
                    obj.stageOrder = index;
                    obj.stageName = item;
                    obj.probability = 100;
                    newPipeLine.stages.push(obj);
                });
                setSelectedItem(newPipeLine);
                setStages(newPipeLine?.stages as Array<Stage>);
                setOriginalStages([...newPipeLine?.stages as Array<Stage>]);
            }
        }

        setIsLoading(false);
    }, [pipeLineId])


    useEffect(() => {
        setCanSave(JSON.stringify(originalsStages) != JSON.stringify(stages) || originalsStages?.length != stages?.length || selectedItem?.pipelineID == 0)
    }, [stages])

    const loadStages=(selectedPipeLineId:number)=>{
        setIsLoading(true);
        if(selectedPipeLineId>0) stagesSvc.getStages(selectedPipeLineId).then(items => {
            let stagesList = Util.sortList(items.stageDtos, "stageOrder");
            setStages(stagesList);
            setOriginalStages(stagesList);
            setIsLoading(false);
        }).catch(err=>{
        });
    }

    const createNewStageObject = () => {
        let obj = new Stage();
        obj.stageOrder = stages?.length + 1;
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

    const addNewStage = (index: number) => {

        let stagesList = stages;
        stagesList.splice(index, 0, createNewStageObject());
        setStages([...stagesList]);
    }

    const prepareToSave = (pipeLineId: number) => {
        let userObj: UserProfile = LocalStorageUtil.getItem(Constants.USER_PROFILE) as any;
        let userName = userObj.user;
        stages.forEach((item, index) => {
            item.stageOrder = index + 1;
            item.pipelineID = pipeLineId;
            if (item.stageID > 0) {
                item.createdBy = item.createdBy ?? userName;
                item.modifiedBy = userName;
            }
            else {
                item.createdBy = userName;
            }
        })
    }

    const saveStages = () => {        
         if(stages.find(s=>!s.stageName)) return;
        if (selectedItem?.pipelineID == 0) {
            var pipeline={
                "pipelineID":selectedItem.pipelineID,
                "pipelineName": selectedItem.pipelineName,
                "description": selectedItem.description,
                "createdBy": selectedItem.createdBy,
                "createdDate": selectedItem.createdDate,
                "modifiedDate":selectedItem.modifiedDate,
                "modifiedBy":selectedItem.modifiedBy
            }
            pipeLineSvc.postItemBySubURL(pipeline, 'SavePipelineDetails').then(res => {
                if (res) {
                    continueToSave(res.pipelineID);
                }

            })
        }
        else {
            continueToSave(selectedItem?.pipelineID);
        }


    }

    const continueToSave = (pipelineID?: number) => {        
        prepareToSave(pipelineID ?? pipeLineId);
        stagesSvc.postItemBySubURL(stages as any, 'SaveStages').then(res => {

            if (res) {
                toast.success(`Pipeline ${(selectedItem as any)?.pipelineID > 0 ? ' updated ' : 'created'} successfully`, { autoClose: 500 });
                setTimeout(() => {
                    navigator("/pipeline?pipelineID=" + pipelineID ?? pipeLineId);
                }, 500);

            }
            else {
                toast.error(res);
            }
        }).catch(error => {
            setError(error);
        })
    }

    const cancelChanges = () => {
        navigator(pipeLineId>0 ? "/pipeline?pipelineID=" + pipeLineId : "/pipeline");
    }

    const deleteStage = () => {
        stagesSvc.delete(selectedItemIndex).then(res => {
            setShowDeleteDialog(false);
            if (res) {
                let index = stages.findIndex(i => i.stageID == selectedItemIndex);
                stages.splice(index, 1);
                toast.success(`Pipeline updated successfully`, { autoClose: 500 });
                setTimeout(() => {
                    navigator("/pipeline?pipelineID=" + pipeLineId);
                }, 500);

            }

        }).catch((err: AxiosError) => {
            setShowDeleteDialog(false);
            setError(err);
        })
    }

    const updateStageItem=(item:Stage, index:number)=>{
        
        let stagesList = [...stages];
        stagesList[index] = item;
        setStages(stagesList);

    }

    return (
        <>
            <Spinner hidden={!isLoading} className="spinner" />
            <div className="rs-container maincontent" style={{ width: "100%" }} hidden={isLoading}>
                <div className="rs-content maincontentinner">
                    {
                        <>
                            <StageActions onAddClick={addNewStage}
                                canSave={canSave}
                                onSaveClick={saveStages}
                                onCancelClick={cancelChanges}
                                selectedItem={selectedItem as any}
                                setSelectedItem={(e: any) => setSelectedItem({ ...selectedItem, "pipelineName": e } as any)} />
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
                    <div className="pdstage-area editstage-area">
                        <div className="container-fluid">

                            <div className="editstage-row scrollable-stages-container">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable
                                        droppableId="board"
                                        type="COLUMN"
                                        direction="vertical"
                                    >
                                        {(provided) => (
                                            <>
                                                <div className="editstage-innerrow" ref={provided.innerRef} {...provided.droppableProps}>
                                                    {stages?.map((item, index) => (
                                                        <StageContainer
                                                            key={index}
                                                            index={index}
                                                            title={item?.stageName}
                                                            selectedItem={item}
                                                            setSelectedItem={(e:any)=>updateStageItem(e, index)}
                                                            onAddClick={(e: any) => addNewStage(e)}
                                                            onDeleteClick={(index: number) => { setShowDeleteDialog(true); setSelectedItemIndex(index) }}
                                                        />
                                                    ))}

                                                    {provided.placeholder}
                                                </div>
                                            </>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <AddNewStage onAddClick={addNewStage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* {error && <UnAuthorized error={error as any} />} */}
        </>
    );
};

export default Stages;
