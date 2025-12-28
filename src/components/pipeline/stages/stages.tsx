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
import { useAuthContext } from "../../../contexts/AuthContext";

type params = {
    isCombineEnabled?: any,
    initial?: any,
    useClone?: any,
    containerHeight?: any,
    withScrollableColumns?: any,
    stages: Array<Stage>

}

export const Stages = (props: params) => {
    const { userProfile } = useAuthContext();
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
    const defaultStages = ["Qualified", "Contact Made", "Demo Scheduled", "Proposal Made", "Negotiations Started"];
    const pipeLineSvc = new PipeLineService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    const [error, setError] = useState<AxiosError>();
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
                newPipeLine.createdBy = userProfile?.userId;
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
        const pipelineNameChanged = selectedItem?.pipelineName !== undefined && selectedItem?.pipelineName !== '';
        setCanSave(
            JSON.stringify(originalsStages) !== JSON.stringify(stages) ||
            originalsStages?.length !== stages?.length ||
            selectedItem?.pipelineID === 0 ||
            pipelineNameChanged
        );
    }, [stages, selectedItem?.pipelineName])

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
        obj.stageID = 0; // New stage
        obj.stageOrder = stages?.length + 1;
        obj.stageName = ""; // Empty name for user to fill
        obj.probability = 0; // Default probability
        obj.pipelineID = selectedItem?.pipelineID || 0;
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

    const addNewStage = (index?: number) => {
        let stagesList = [...stages];
        const newStage = createNewStageObject();
        
        if (index !== undefined) {
            stagesList.splice(index, 0, newStage);
        } else {
            // Add at the end when no index is provided (from AddNewStage component)
            stagesList.push(newStage);
        }
        
        setStages(stagesList);
    }

    const prepareToSave = (pipeLineId: number) => {
        let userId = userProfile?.userId;
        if (!pipeLineId || isNaN(pipeLineId)) {
            console.error("Pipeline ID is missing or invalid");
            return; // Do not proceed if pipelineID is invalid
        }
    
        stages.forEach((item, index) => {
            item.stageOrder = index + 1;
            item.pipelineID = pipeLineId;
            item.stageName = item.stageName?.trim();
            if (!item.stageName) {
                console.error(`Stage name is missing for stage at index ${index}`);
            }
            if (item.stageID > 0) {
                item.createdBy = item.createdBy ?? userId;
                item.modifiedBy = userId;
            }
            else {
                item.createdBy = userId;
            }
        })
    }

    const saveStages = async () => {
        // Validate that all stages have names
        const invalidStages = stages.filter(s => !s.stageName || s.stageName.trim() === '');
        if (invalidStages.length > 0) {
            toast.error("All stages must have a name");
            return;
        }
        
        // Validate that all stages have valid probabilities
        const invalidProbabilities = stages.filter(s => s.probability === null || s.probability === undefined || s.probability < 0 || s.probability > 100);
        if (invalidProbabilities.length > 0) {
            toast.error("All stages must have a probability between 0 and 100");
            return;
        }

        // Check for duplicate pipeline name (only for new pipelines)
        if (selectedItem?.pipelineID === 0) {
            try {
                const existingPipelines = await pipeLineSvc.getPipeLines();
                const duplicateName = existingPipelines.find((p:any) => 
                    p.pipelineName?.toLowerCase().trim() === selectedItem?.pipelineName?.toLowerCase().trim()
                );
                if (duplicateName) {
                    toast.error("A pipeline with this name already exists");
                    return;
                }
            } catch (error) {
                console.error("Error checking for duplicate pipeline names:", error);
            }
        }
        
        // Always save pipeline details first (for both new and existing pipelines)
        const pipeline = {
            "pipelineID": selectedItem?.pipelineID,
            "pipelineName": selectedItem?.pipelineName,
            "description": selectedItem?.description,
            "createdBy": selectedItem?.createdBy,
            "createdDate": selectedItem?.createdDate,
            "modifiedDate": selectedItem?.modifiedDate,
            "modifiedBy": selectedItem?.modifiedBy
        };
        
        pipeLineSvc.postItemBySubURL(pipeline, 'SavePipelineDetails').then(res => {
            if (res && res.result?.pipelineID) {
                console.log("Pipeline API Response:", res);
                continueToSave(res.result.pipelineID);
            } else if (selectedItem?.pipelineID) {
                // If backend doesn't return pipelineID, use existing one
                continueToSave(selectedItem.pipelineID);
            } else {
                toast.error("Pipeline saved but no pipelineID returned.");
                console.error("Pipeline Save Response Missing pipelineID:", res);
            }
        }).catch(err => {
            toast.error("Error saving pipeline details");
            console.error("Pipeline Save Error:", err);
        });
    }

    const continueToSave = (pipelineID: number | undefined) => {        
        if (!pipelineID || isNaN(pipelineID)) {
            toast.error("Pipeline ID is missing or invalid");
            console.error("Pipeline ID is missing or invalid in continueToSave");
            return;
        }
    
        prepareToSave(pipelineID); // Assign pipelineID to all stages before sending
        console.log("Prepared Stages Payload:", stages);
        stagesSvc.postItemBySubURL(stages as any, 'SaveStages').then(res => {

            if (res) {
                console.log("Stages Save Response:", res);
                toast.success(`Pipeline ${(selectedItem as any)?.pipelineID > 0 ? ' updated ' : 'created'} successfully`, { autoClose: 500 });
                setTimeout(() => {
                   // navigator("/pipeline?pipelineID=" + pipelineID ?? pipeLineId);
                  //  navigator("/pipeline?pipelineID=" + (pipelineID || pipeLineId));
                  navigator(`/pipeline?pipelineID=${pipelineID}`);
                }, 500);

            }
            else {
                toast.error(res);
            }
        }).catch(error => {
            setError(error);
            console.error("Error Saving Stages:", error);
            
            // Show specific error message from API response
            let errorMessage = "Error saving stages";
            if (error?.response?.data?.title) {
                errorMessage = error.response.data.title;
            } else if (error?.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                errorMessage = errorMessages.join(", ");
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        })
    }

    const cancelChanges = () => {
        navigator(pipeLineId>0 ? "/pipeline?pipelineID=" + pipeLineId : "/pipeline");
    }

    const deleteStage = async () => {
  try {
    // Treat selectedItemIndex as a stageID first
    let index = stages.findIndex(i => i.stageID === selectedItemIndex);

    // If not found, allow using it as an array index ONLY for new (unsaved) stages
    if (
      index === -1 &&
      selectedItemIndex >= 0 &&
      selectedItemIndex < stages.length &&
      (!stages[selectedItemIndex]?.stageID || stages[selectedItemIndex]?.stageID === 0)
    ) {
      index = selectedItemIndex;
    }

    if (index === -1) {
      toast.error('Stage not found');
      setShowDeleteDialog(false);
      return;
    }

    const stageToDelete = stages[index];

    // If the stage is new/unsaved, just remove it locally
    if (!stageToDelete.stageID || stageToDelete.stageID === 0) {
      const newStages = [...stages];
      newStages.splice(index, 1);
      setStages(newStages);
      setShowDeleteDialog(false);
      toast.success('Stage removed successfully', { autoClose: 800 });
      return;
    }

    // Saved stage: call API and only remove if server confirms success
    const res = await stagesSvc.delete(stageToDelete.stageID);
    setShowDeleteDialog(false);

    if (!res || res.success === false) {
      toast.error(res?.message || 'Failed to delete stage on the server', { autoClose: 3000 });
      return; // DO NOT remove locally if server failed
    }

    const newStages = [...stages];
    newStages.splice(index, 1);
    setStages(newStages);

    toast.success(res?.message || 'Stage deleted successfully', { autoClose: 800 });

    // Optional: if you really want to reload the page view, uncomment the next line
    // navigator(`/pipeline?pipelineID=${pipeLineId}`);
  } catch (err: any) {
    setShowDeleteDialog(false);
    setError(err);
    toast.error(err?.message || 'Error deleting stage', { autoClose: 3000 });
    console.error('Delete stage error:', err);
  }
};

    const updateStageItem = (item: Stage, index: number) => {
        if (index >= 0 && index < stages.length) {
            let stagesList = [...stages];
            stagesList[index] = { ...item }; // Create a copy to ensure proper state update
            setStages(stagesList);
        }
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
                                setSelectedItem={setSelectedItem}
                            />
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

                            <div className="editstage-row scrollable-stages-container" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}>
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
                                                            key={item.stageID ?? `temp-${index}`}
                                                            index={index}
                                                            title={item?.stageName}
                                                            selectedItem={item}
                                                            setSelectedItem={(e:any)=>updateStageItem(e, index)}
                                                            onAddClick={(e: any) => addNewStage(e)}
                                                            onDeleteClick={() => { 
    setSelectedItemIndex(item.stageID ?? index); // keep for now
    setShowDeleteDialog(true); 
  }}
                                                        />
                                                    ))}

                                                    {provided.placeholder}
                                                </div>
                                            </>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <AddNewStage onAddClick={addNewStage} stages={stages} />
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