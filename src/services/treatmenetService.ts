import { Treatment } from "../models/treatment";
import { BaseService } from "./BaseService";

export class TreatmentService extends BaseService<Treatment>{
    constructor(errorHandler: any){
        super("Treatment", "Treatment", errorHandler);
    }
}