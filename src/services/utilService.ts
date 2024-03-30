import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";
import { Utility } from "../models/utility";

export class UtilService extends BaseService<Utility>{
    constructor(errorHandler: any){
        super("Utility", "Utility", errorHandler);
    }

    getDropdownValues(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL("GetAllDropdonws");
    }
}