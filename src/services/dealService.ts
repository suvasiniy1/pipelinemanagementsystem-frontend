import { CancelTokenSource } from "axios";
import { Deal } from "../models/deal";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class DealService extends BaseService<Deal>{
    constructor(errorHandler: any){
        super("Deal", "Deal", errorHandler);
    }

    getDeals(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Deal/GetDealDetails')
    }

    getDealsById(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ?  'mockData/deals.json' : 'Deal/'+dealId)
    }

    deleteDeal(dealId:number){
        return this.delete(dealId, "Deal");
    }
    updateAllDeals(deals: Partial<Deal>[], axiosCancel?: CancelTokenSource) {
        return this.putItemBySubURL(deals, 'UpdateAllDeals', axiosCancel);
    }
}