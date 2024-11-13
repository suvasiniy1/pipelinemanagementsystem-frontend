import { CancelTokenSource } from "axios";
import { DealFilter } from "../models/dealFilters";
import { BaseService } from "./BaseService";

export class DealFiltersService extends BaseService<DealFilter>{
    constructor(errorHandler: any){
        super("DealFilter", "DealFilter", errorHandler);
    }

    getDealFilters(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'DealFilter/GetDealfilters')
    }

    saveDealFilters(dealFilters:DealFilter, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'DealFilter/SaveDealFilter')
    }
}