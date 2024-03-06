import { CancelTokenSource } from "axios";
import { PipeLine } from "../models/pipeline";
import { BaseService } from "./BaseService";

export class PipeLineService extends BaseService<PipeLine>{

    constructor(errorHandler: any){
        super("PipeLine", "PipeLine", errorHandler);
    }

    getPipeLines(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Pipeline/GetAllPipelineDetails')
    }

}