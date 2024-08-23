import { BaseService } from "./BaseService";

export class ReportingService extends BaseService<any> {
    constructor(errorHandler: any){
        super("Reporting", "Reporting", errorHandler);
    }

    getReports(){
        return this.getItemsByRelativeURL('mockData/reporting.json')
    }
}
