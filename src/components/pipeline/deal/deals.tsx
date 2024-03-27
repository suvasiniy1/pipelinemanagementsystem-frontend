
// @flow
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { DealHeader } from "./dealHeader";
import { DealStage } from "./dealStage";
import { PipeLineService } from "../../../services/pipeLineService";
import { ErrorBoundary } from "react-error-boundary";
import { StageService } from "../../../services/stageService";
import { DealService } from "../../../services/dealService";
import { PipeLine } from "../../../models/pipeline";
import { Deal } from "../../../models/deal";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { UnAuthorized } from "../../../common/unauthorized";
import Util from "../../../others/util";
import { Spinner } from "react-bootstrap";

type params = {
    isCombineEnabled?: any,
    initial?: any,
    useClone?: any,
    containerHeight?: any,
    withScrollableColumns?: any,
    rowData?: Array<Stage>;
    onSaveChanges?: any;

}

export const Deals = (props: params) => {

    const [isLoading, setIsLoading] = useState(false);
    const pipeLineSvc = new PipeLineService(ErrorBoundary);
    const stagesSvc = new StageService(ErrorBoundary);
    const dealsSvc = new DealService(ErrorBoundary);
    const [pipeLines, setPipeLines] = useState<Array<PipeLine>>([]);
    const [stages, setStages] = useState<Array<Stage>>([]);
    const [selectedItem, setSelectedItem] = useState<PipeLine>();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<AxiosError>();
    const [deals, setDeals]=useState<Array<Deal>>([]);
    const navigate = useNavigate();
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipelineID") as any);
    const userProfile = Util.UserProfile();

    // useEffect(() => {
    //     debugger
    //     if(+pipeLineId>0) loadStages(pipeLineId);
    // }, [pipeLineId])

    useEffect(()=>{
        loadPipeLines()
    },[])



    const loadPipeLines = () => {
        setIsLoading(true);
        
        pipeLineSvc.getPipeLines().then((res: Array<PipeLine>) => {
            setPipeLines(res);
            let selectedPipeLineId = pipeLineId > 0 ? pipeLineId : res[0].pipelineID;
            setPipeLineId(selectedPipeLineId);
            setSelectedItem(res.find(i => i.pipelineID == selectedPipeLineId));
            loadStages(selectedPipeLineId);

        }).catch((err: AxiosError) => {
            setError(err);
        });
    }

    const loadStages=(selectedPipeLineId:number)=>{
        setIsLoading(true);
        stagesSvc.getStages(selectedPipeLineId).then(items => {
            setStages(items.stageDtos);
            setIsLoading(false);
            
        });
    }

    useEffect(() => {
        if (selectedItem?.pipelineID != pipeLineId && (selectedItem?.pipelineID as any)>0) {
            loadStages(selectedItem?.pipelineID as any);
        }
    }, [selectedItem])

    const onDragEnd = (result: any) => {
        const source = result.source;
        const destination = result.destination;
        if (source.droppableId === destination.droppableId) { return; }
        else {
            setIsLoading(true);
            dealsSvc.putItemBySubURL({
                "newStageId": +destination.droppableId,
                "modifiedById": userProfile.userId,
                "dealId": +source.index
            }, +source.index + "/stage").then(res => {
                loadPipeLines();
            });

        }




    };

    return (
        <>
            {isLoading ? <div className="alignCenter"><Spinner /></div> :
                <>
                    <div className="pdstage-mainarea">
                        <DealHeader canAddDeal={pipeLines.length > 0}
                            onSaveChanges={(e: any) => loadPipeLines()}
                            selectedItem={selectedItem as any}
                            setSelectedItem={(e: any) => setSelectedItem(e)}
                            pipeLinesList={pipeLines}
                            stagesList={stages}
                        />
                        <div className="pdstage-area">
                            <div className="pdstagearea-inner">

                                <div className="pdstage-row" hidden={pipeLines.length == 0}>
                                    <DragDropContext onDragEnd={onDragEnd} onDragStart={(e: any) => setIsDragging(true)}>
                                        <Droppable
                                            droppableId="board"
                                            type="COLUMN"
                                            direction="horizontal"
                                        >
                                            {(provided) => (
                                                <>
                                                    {stages?.map((item, index) => (
                                                        <DealStage
                                                            key={index}
                                                            stageID={item.stageID}
                                                            title={item.stageName}
                                                            deals={item.deals}
                                                            providedFromParent={provided}
                                                            isDragging={isDragging}
                                                            pipeLinesList={pipeLines}
                                                            onSaveChanges={(e: any) => props.onSaveChanges()}
                                                        />
                                                    )
                                                    )}
                                                    {/* {provided.placeholder} */}
                                                </>
                                            )}
                                        </Droppable>

                                    </DragDropContext>


                                </div>
                                <div style={{ textAlign: "center" }} hidden={pipeLines.length > 0}>
                                    No pipelines are avilable to show
                                </div>
                            </div>
                        </div>
                    </div>
                    {error && <UnAuthorized error={error as any} />}

                </>
            }
            <ToastContainer />
        </>
    );
};
