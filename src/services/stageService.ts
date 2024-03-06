import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";

export class StageService extends BaseService<Stage>{
    constructor(errorHandler: any){
        super("Stage", "Stage", errorHandler);
    }

    getStages(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Stage/GetAllStageDetails')
    }
}