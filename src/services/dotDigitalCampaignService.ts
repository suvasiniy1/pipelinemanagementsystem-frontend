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
        if (window.config.DisableDotDigitalAPI) {
            return Promise.resolve({ data: null });
        }
        return this.getItemsBySubURL("GetDotDigitalPrograms");
      }
    
}