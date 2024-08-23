import { CancelTokenSource } from "axios";
import { DealAuditLog } from "../models/dealAutidLog";
import { BaseService } from "./BaseService";

export class DealAuditLogService extends BaseService<DealAuditLog>{
    constructor(errorHandler: any){
        super("DealAuditLog", "DealAuditLog", errorHandler);
    }

    getDealLogs(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItemsBySubURL(`GetAuditLogsByDealId/${dealId}`, axiosCancel)
    }
}