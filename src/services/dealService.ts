import { CancelTokenSource } from "axios";
import { Deal } from "../models/deal";
import { BaseService } from "./BaseService";

export class DealService extends BaseService<Deal>{
    constructor(errorHandler: any){
        super("Deal", "Deal", errorHandler);
    }

    getDeals(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Deal/GetDealDetails')
    }

    getDealsById(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Deal/'+dealId)
    }
}