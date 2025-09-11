import { CancelTokenSource } from "axios";
import { CreateReportRequest } from '../models/reportModels';
import { BaseService } from './BaseService';
import { IsMockService } from '../others/util';

export class ReportService extends BaseService<CreateReportRequest> {
    constructor(errorHandler: any) {
        super("Report", "Report", errorHandler);
    }

    saveReport(request: CreateReportRequest, axiosCancel?: CancelTokenSource) {
        return this.postItemBySubURL(request, "Savereport", false, false, axiosCancel);
    }

    updateReport(reportId: number, request: CreateReportRequest, axiosCancel?: CancelTokenSource) {
        return this.putItemBySubURL(request, reportId.toString(), axiosCancel);
    }

    deleteReport(reportId: number, axiosCancel?: CancelTokenSource) {
        return this.delete(reportId);
    }

    getReports(axiosCancel?: CancelTokenSource) {
        return this.getItems(
            axiosCancel,
            IsMockService() ? 'mockData/reports.json' : 'Report/GetReport'
        );
    }
}