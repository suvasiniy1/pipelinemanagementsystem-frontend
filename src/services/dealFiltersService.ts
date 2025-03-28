import { CancelTokenSource } from "axios";
import { DealFilter } from "../models/dealFilters";
import { BaseService } from "./BaseService";

export class DealFiltersService extends BaseService<DealFilter>{
    constructor(errorHandler: any){
        super("DealFilter", "DealFilter", errorHandler);
    }

    getDealFilters(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL('GetDealfilters', axiosCancel)
    }

    saveDealFilters(dealFilters:DealFilter, axiosCancel?: CancelTokenSource){
        return this.postItemBySubURL(dealFilters, 'SaveDealfilters')
    }

    getDotDigitalProgramsList(dealFilters:DealFilter, axiosCancel?: CancelTokenSource){
        return this.postItemBySubURL(dealFilters, 'SaveDealfilters')
    }
    getJustCallCampaignList(dealFilters: DealFilter, axiosCancel?: CancelTokenSource){
        return this.postItemBySubURL(dealFilters, 'SaveDealfilters')
    }
   
}