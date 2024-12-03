
// @flow
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UnAuthorized } from "../../../common/unauthorized";
import { Deal } from "../../../models/deal";
import { PipeLine } from "../../../models/pipeline";
import { Stage } from "../../../models/stage";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import Util, { IsMockService } from "../../../others/util";
import { DealService } from "../../../services/dealService";
import { PipeLineService } from "../../../services/pipeLineService";
import { StageService } from "../../../services/stageService";
import { UtilService } from "../../../services/utilService";
import { DealHeader } from "./dealHeader";
import DealListView from "./dealListView";
import { DealStage } from "./dealStage";
import DealsByStage from "./dealsByStage";

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
    const [originalStages, setOriginalStages] = useState<Array<Stage>>([]);
    const [selectedItem, setSelectedItem] = useState<PipeLine>();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<AxiosError>();
    const [deals, setDeals] = useState<Array<Deal>>([]);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [selectedStageId, setSelectedStageId] = useState(null);
    const [stageIdForExpand, setStageIdForExpand] = useState(null);
    const [viewType, setViewType] = useState("kanban");
    const [totalDeals, setTotalDeals] = useState<Array<Deal>>([]);
    const [selectedStageName, setSelectedStageName] = useState("");
    const [isLoadingMore, setIsLoadingMore]=useState(false);
    const defaultPageSize = 10;
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipelineID") as any);
    const userProfile = Util.UserProfile();
    const utilSvc = new UtilService(ErrorBoundary);
    const [pageSize, setPageSize] = useState(10);

    // useEffect(() => {
    //     
    //     if(+pipeLineId>0) loadStages(pipeLineId);
    // }, [pipeLineId])

    useEffect(() => {

        loadPipeLines();
        loadAllPipeLinesAndStages();
        utilSvc.getDropdownValues().then(res => {
            
            let result = IsMockService() ? res?.data : res?.utility
            if (result) {
                LocalStorageUtil.setItemObject(Constants.UTILITY, JSON.stringify(result));
            }
        }).catch(err => {
            setError(err);
        })
    }, [])


    const loadAllPipeLinesAndStages=()=>{
        stagesSvc.getAllPipeLinesAndStages().then(res=>{
            localStorage.setItem("getAllPipeLinesAndStages", JSON.stringify(res.data));
        })
    }



    const loadPipeLines = () => {
        setIsLoading(true);

        pipeLineSvc.getPipeLines().then((res: Array<PipeLine>) => {
            
            setPipeLines(res);
            localStorage.setItem("allPipeLines", JSON.stringify(res));
            let selectedPipeLineId = pipeLineId > 0 ? pipeLineId : res[0].pipelineID;
            setPipeLineId(selectedPipeLineId);
            setSelectedItem(res.find(i => i.pipelineID == selectedPipeLineId));
            loadStages(selectedPipeLineId);

        }).catch((err: AxiosError) => {
            setError(err);
        });
    }

    const loadStages = (selectedPipeLineId: number, skipLoading: boolean = false, pagesize: number = 10, fromDealModify:boolean=false) => {
        
        if(!skipLoading) setIsLoading(true);
        if (selectedPipeLineId > 0) stagesSvc.getStages(selectedPipeLineId, 1, pagesize ?? pageSize).then(items => {
            let sortedStages = Util.sortList(items.stageDtos, "stageOrder");
            let totalDealsList: Array<Deal> = [];
            sortedStages.forEach((s: Stage) => {
                s.deals.forEach(d => {
                    totalDealsList.push(d);
                })
            });

            setTotalDeals([...totalDealsList])
            setStages(sortedStages);
            setOriginalStages(sortedStages);
            setIsLoading(false);
            setIsLoadingMore(false);
            setTimeout(() => {
                if(skipLoading && fromDealModify){
                    toast.success("Deal updated successfully.", );
                }
            }, 100);

        }).catch(err => {
            setError(err);
        });
    }

    const loadMoreDeals = () => {
        setIsLoadingMore(true);
        setPageSize(pageSize => pageSize + defaultPageSize);
        loadStages(pipeLineId, true, pageSize + defaultPageSize);
    };

    useEffect(() => {
        LocalStorageUtil.setItemObject(Constants.PIPE_LINE, selectedItem);
        loadStages(selectedItem?.pipelineID as any);
    }, [selectedItem])

    const onDragEnd = (result: any) => {

        const source = result.source;
        const destination = result.destination;
        if (source && destination) {
            if (source.droppableId === destination.droppableId) { return; }
            else {
                let stagesList = [...stages];
                let sourceIndex = stagesList.findIndex(s => s.stageID == +source.droppableId);
                let destinationIndex = stagesList.findIndex(s => s.stageID == +destination.droppableId);
                let dItem = stagesList[sourceIndex]?.deals?.find(d => d.dealID == +source.index);
                let dIndex = stagesList[sourceIndex]?.deals?.findIndex(d => d.dealID == +source.index);
                stagesList[sourceIndex]?.deals.splice(dIndex, 1);
                stagesList[destinationIndex].deals.push(dItem as any);

                setStages([...stagesList]);

                setIsLoading(true);

                dealsSvc.putItemBySubURL({
                    "newStageId": +destination.droppableId,
                    "modifiedById": userProfile.userId,
                    "dealId": +source.index,
                    "pipelineId":selectedItem?.pipelineID
                }, +source.index + "/stage").then(res => {
                    loadStages(selectedItem?.pipelineID as any, true);
                }).catch(err => {
                    setError(err);
                    setStages([...originalStages]);
                })

            }
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
                            selectedStageId={dialogIsOpen ? null : selectedStageId as any}
                            onDealDialogClose={(e: any) => setSelectedStageId(null)}
                            setViewType={(e: any) => setViewType(e)}
                        />
                        {viewType === "kanban" ?
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
                                                                onDealModify={(e:any)=>{loadStages(selectedItem?.pipelineID as any, true, null as any, true);}}
                                                                onDealAddClick={(e: any) => setSelectedStageId(e)}
                                                                onStageExpand={(e: any) => { setSelectedStageName(item.stageName); setDialogIsOpen(true); setStageIdForExpand(e) }}
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
                                    <div className="loadingmore">
                                        <div style={{ textAlign: "center" }} hidden={isLoadingMore || pipeLines.length==0}>
                                        <button type="button" className="btn btn-primary" onClick={(e: any) => loadMoreDeals()}>Load More</button>
                                        </div>
                                        <div style={{ textAlign: "center" }} hidden={!isLoadingMore}>
                                            Loading More...
                                        </div>
                                    </div>
                                    <div className="nopipelinesmsg" style={{ textAlign: "center" }} hidden={pipeLines.length > 0}>
                                        No pipelines are avilable to show
                                    </div>
                                </div>
                            </div> : <DealListView pipeLineId={selectedItem?.pipelineID ?? pipeLineId} />}
                    </div>
                    {error && <UnAuthorized error={error as any} />}
                    {
                        dialogIsOpen && <DealsByStage   stageId={stageIdForExpand as any}
                                                        stageName={selectedStageName as any}
                                                        dialogIsOpen={dialogIsOpen}
                                                        setDialogIsOpen={setDialogIsOpen} />
                    }
                </>
            }

        </>
    );
};
