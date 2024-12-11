import { CancelTokenSource } from "axios";
import {JustcallCampagin } from "../models/justcallCampagin";
import { BaseService } from "./BaseService";

export class JustcallCampaignService extends BaseService<JustcallCampagin>{
    constructor(errorHandler: any){
        super("GetJustCallCampaignList", "GetJustCallCampaignList", errorHandler);
    }

    getJustCallCampaignList(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL('GetJustCallCampaignList')
    }
}