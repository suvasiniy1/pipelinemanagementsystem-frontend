import { CancelTokenSource } from "axios";
import { AssetType, Campaign, CampaignAssets } from "../models/campaign";
import { BaseService } from "./BaseService";

export class CampaignService extends BaseService<Campaign>{
    constructor(errorHandler: any){
        super("Campaign", "Campaign", errorHandler);
    }

    getCampaigns(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL('mockData/campaigns.json')
    }

    deleteCampaigne(noteId:number){
        return this.delete(noteId)
    }

    getcampaignAssets(){
        return this.getItemsBySubURL('mockData/campaignAssets.json')
    }
}