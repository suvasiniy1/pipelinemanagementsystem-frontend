import { CancelTokenSource } from "axios";
import { Treatment } from "../models/treatment";
import { IsMockService } from "../others/util";
import { BaseService } from "./BaseService";

export class TreatmentService extends BaseService<Treatment>{
    constructor(errorHandler: any){
        super("Treatment", "Treatment", errorHandler);
    }
    getTreatments(axiosCancel?: CancelTokenSource) {
        return this.getItems(
            axiosCancel,
            IsMockService() ? 'mockData/treatment.json' : 'Treatment/GetAllTreatmentDetails'
        );
    }
}