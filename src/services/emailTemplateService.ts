import { CancelTokenSource } from "axios";
import { Deal } from "../models/deal";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";
import { EmailTemplate } from "../models/emailTemplate";

export class EmailTemplateService extends BaseService<EmailTemplate>{
    constructor(errorHandler: any){
        super("EmailTemplate", "EmailTemplate", errorHandler);
    }
    
    getEmailTemplates(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'EmailTemplate/GetAllTemplates')
    }

    getTemplateById(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ?  'mockData/deals.json' : 'EmailTemplate/GetTemplateById'+dealId)
    }

    deleteTemplate(templateId:number){
        return this.delete(templateId, `EmailTemplate/`);
    }
}