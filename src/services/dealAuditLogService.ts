import { CancelTokenSource } from "axios";
import { DealAuditLog, PostAuditLog } from "../models/dealAutidLog";
import { BaseService } from "./BaseService";

export class DealAuditLogService extends BaseService<DealAuditLog>{
    constructor(errorHandler: any){
        super("DealAuditLog", "DealAuditLog", errorHandler);
    }

    getDealLogs(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL(`GetAuditLogsByDealId/${dealId}`, axiosCancel)
    }

    postAuditLog(item:PostAuditLog, axiosCancel?: CancelTokenSource){
        return this.postItemBySubURL(item, `LogAuditEvent`, null as any, true, axiosCancel)
    }

    getDealTimeLine(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL(`GetDealTimeline/${dealId}`, axiosCancel)
    }
}