import { CancelTokenSource } from "axios";
import { Clinic } from "../models/clinic";
import { BaseService } from "./BaseService";

export class ClinicService extends BaseService<Clinic>{
    constructor(errorHandler: any){
        super("Clinic", "Clinic", errorHandler);
    }
}