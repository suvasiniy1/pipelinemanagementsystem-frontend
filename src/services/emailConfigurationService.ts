import { CancelTokenSource } from "axios";
import { EmailConfiguration } from "../models/emailConfiguration";
import { IsMockService } from "../others/util";
import { BaseService } from "./BaseService";

export class EmailConfigurationService extends BaseService<EmailConfiguration>{
    constructor(errorHandler: any){
        super("EmailConfiguration", "EmailConfiguration", errorHandler);
    }

    getEmailConfigurations(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL(`GetAll`)
    }

    deleteNote(noteId:number){
        return this.delete(noteId)
    }
}