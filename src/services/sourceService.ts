import { Source } from "../models/source";
import { BaseService } from "./BaseService";

export class SourceService extends BaseService<Source>{
    constructor(errorHandler: any){
        super("Source", "Source", errorHandler);
    }
}