import { CancelTokenSource } from "axios";
import { EnquiryForm } from "../models/enquiryForm";
import { BaseService } from "./BaseService";

export class EnquiryFormService extends BaseService<EnquiryForm>{
    constructor(errorHandler: any){
        super("EnquiryForm", "EnquiryForm", errorHandler);
    }

    getEnquiryForms(axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL(`GetEnquiryForms`, axiosCancel)
    }
}