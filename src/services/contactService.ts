import { CancelTokenSource } from "axios";
import { Contact } from "../models/contact";
import { IsMockService } from "../others/util";
import { BaseService } from "./BaseService";

export class ContacteService extends BaseService<Contact>{
    constructor(errorHandler: any){
        super("Contact", "Contact", errorHandler);
    }
    
    getContacts(axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, 'Contact')
    }

    getContactById(contactId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ?  'mockData/deals.json' : `Contact/${contactId}`)
    }

    deleteContact(contactId:number){
        return this.delete(contactId, `Contact/${contactId}`);
    }
}