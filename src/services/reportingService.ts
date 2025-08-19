import { BaseService } from "./BaseService";

export class ReportingService extends BaseService<any> {
    constructor(errorHandler: any){
        super("Reporting", "Reporting", errorHandler);
    }

    getReports(){
        return this.getItemsByRelativeURL('mockData/reporting.json')
    }

    getDealReports(){
        return this.getItemsByRelativeURL('mockData/dealReports.json')
    }

    getDealConversionFunnel(){
        return this.getDealReports().then((data: any) => data.dealConversionFunnel)
    }

    getSalesPerformance(){
        return this.getDealReports().then((data: any) => data.salesPerformance)
    }

    getTreatmentAnalysis(){
        return this.getDealReports().then((data: any) => data.treatmentAnalysis)
    }

    getUserPerformance(){
        return this.getDealReports().then((data: any) => data.userPerformance)
    }

    getLeadSourceAnalysis(){
        return this.getDealReports().then((data: any) => data.leadSourceAnalysis)
    }

    getPipelineHealth(){
        return this.getDealReports().then((data: any) => data.pipelineHealth)
    }
}
