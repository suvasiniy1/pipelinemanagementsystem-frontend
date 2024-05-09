import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class StageService extends BaseService<Stage>{
    constructor(errorHandler: any){
        super("Stage", "Stage", errorHandler);
    }

    getStages(pipelineId:number,  pageNo:number=1, pageSize:number=5, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/stages.json' : `Stage/GetAllStageDetails?PipelineId=${pipelineId}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }

    getDealsbyStageId(stageId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, `Stage/GetDealsByStage?stageId=${stageId}`)
    }
}