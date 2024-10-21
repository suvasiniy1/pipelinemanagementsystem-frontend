import { CancelTokenSource } from "axios";
import { Deal, DealCustomFields } from "../models/deal";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class CustomFieldsService extends BaseService<DealCustomFields>{
    constructor(errorHandler: any){
        super("CustomDealFields", "CustomDealFields", errorHandler);
    }

    getCustomFields(dealId:number,axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, `CustomDealFields/GetCustomFieldsByDealID?Id=${dealId}`)
    }
}