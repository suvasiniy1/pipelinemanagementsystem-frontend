import { CancelTokenSource } from "axios";
import { DotdigitalCampagin } from "../models/dotdigitalCampagin";
import { BaseService } from "./BaseService";

export class DotDigitalCampaignService extends BaseService<DotdigitalCampagin>{
    constructor(errorHandler: any){
        super("DotDigitalCampaignList", "DotDigitalCampaignList", errorHandler);
    }

    getDotDigitalCampaignList(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL('GetDotDigitalCampaigns')
    }
    getDotDigitalPrograms() {
        return this.getItemsBySubURL("GetDotDigitalPrograms");
      }
    
}