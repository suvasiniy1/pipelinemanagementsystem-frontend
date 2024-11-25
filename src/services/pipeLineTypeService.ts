import { CancelTokenSource } from "axios";
import { BaseService } from "./BaseService";
import { PipeLineType } from "../models/pipeLineType";
import { IsMockService } from "../others/util";

export class PipeLineTypeService extends BaseService<PipeLineType> {
    constructor(errorHandler: any) {
        super("PipeLineType", "PipeLineType", errorHandler);
    }

    // Method to fetch pipeline types
    getPipelineTypes(axiosCancel?: CancelTokenSource) {
        return this.getItems(
            axiosCancel,
            IsMockService() ? 'mockData/pipelineType.json' : 'PipeLineType/GetAllPipeLineTypeDetails'
        );
    }
}
