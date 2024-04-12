
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
import Util from "../../../others/util";
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
    const navigate = useNavigate();
    const listInnerRef = useRef();
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipelineID") as any);
    const userProfile = Util.UserProfile();
    const utilSvc = new UtilService(ErrorBoundary);
    const [pageSize, setPageSize] = useState(5);

    // useEffect(() => {
    //     debugger
    //     if(+pipeLineId>0) loadStages(pipeLineId);
    // }, [pipeLineId])

    useEffect(() => {
        loadPipeLines();
        utilSvc.getDropdownValues().then(res => {
            if (res?.data?.utility) {
                LocalStorageUtil.setItemObject(Constants.UTILITY, JSON.stringify(res?.data?.utility));
            }
        }).catch(err => {
            setError(err);
        })
    }, [])



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

    const loadStages = (selectedPipeLineId: number, skipLoading: boolean = false, pagesize: number = 5) => {
        
        setIsLoading(true);
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
            setTimeout(() => {
                if(skipLoading){
                    toast.success("Deal updated successfully.", );
                }
            }, 100);

        }).catch(err => {
            setError(err);
        });
    }

    const onScroll = () => {

        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight;

            if (isNearBottom) {
                setPageSize(pageSize => pageSize + 5);
                loadStages(pipeLineId, true, pageSize + 5);
            }
        }
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
                                <div className="pdstagearea-inner" ref={listInnerRef as any} onScroll={(e: any) => onScroll()}>

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
                                                                onDealModify={(e:any)=>{loadStages(selectedItem?.pipelineID as any, true);}}
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
                                    <div style={{ textAlign: "center" }} hidden={pipeLines.length > 0}>
                                        No pipelines are avilable to show
                                    </div>
                                </div>
                            </div> : <DealListView dealsList={totalDeals} />}
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
