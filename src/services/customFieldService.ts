import { DealCustomFields } from "../models/deal";
import { BaseService } from "./BaseService";

export class CustomFieldService extends BaseService<DealCustomFields>{
    constructor(errorHandler: any){
        super("CustomField", "CustomField", errorHandler);
    }
}