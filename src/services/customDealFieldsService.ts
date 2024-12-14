import { CancelTokenSource } from "axios";
import { DealCustomFields } from "../models/deal";
import { BaseService } from "./BaseService";

export class CustomDealFieldsService extends BaseService<DealCustomFields>{
    constructor(errorHandler: any){
        super("CustomDealFields", "CustomDealFields", errorHandler);
    }

    getCustomFields(dealId:number,pipelineId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, `CustomDealFields/GetCustomFieldsByDealID?Id=${dealId}&pipelineId=${pipelineId}`)
    }
}