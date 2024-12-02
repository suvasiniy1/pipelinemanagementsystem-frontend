import { CancelTokenSource } from "axios";
import { Clinic } from "../models/clinic";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class ClinicService extends BaseService<Clinic>{
    constructor(errorHandler: any){
        super("Clinic", "Clinic", errorHandler);
    }
    getClinics(axiosCancel?: CancelTokenSource) {
        return this.getItems(
            axiosCancel,
            IsMockService() ? 'mockData/clinic.json' : 'Clinic/GetAllClinicDetails'
        );
    }
}