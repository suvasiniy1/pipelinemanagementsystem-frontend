import { CancelTokenSource } from "axios";
import {JustcallCampagin } from "../models/justcallCampagin";
import { BaseService } from "./BaseService";

export class JustcallCampaignService extends BaseService<JustcallCampagin>{
    constructor(errorHandler: any){
        super("JustCallCampaign", "JustCallCampaign", errorHandler);
    }

    getJustCallCampaignList(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL('GetJustCallCampaignList')
    }
    addContactToCampaign(data: any) {
        return this.postItemBySubURL("AddContactToCampaign", data);
    }

    createCampaign(data: any) {
        return this.postItemBySubURL("CreateCampaign", data);
    }
}