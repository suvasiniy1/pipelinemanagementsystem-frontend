import { CancelTokenSource } from "axios";
import { Source } from "../models/source";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class SourceService extends BaseService<Source>{
    constructor(errorHandler: any){
        super("Source", "Source", errorHandler);
    }
    getSources(axiosCancel?: CancelTokenSource) {
        return this.getItems(
            axiosCancel,
            IsMockService() ? 'mockData/source.json' : 'Source/GetAllSourceDetails'
        );
    }
}