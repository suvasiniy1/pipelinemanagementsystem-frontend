import { CancelTokenSource } from "axios";
import { DealEmailLog } from "../models/dealAutidLog";
import { BaseService } from "./BaseService";

export class DealEmailLogService extends BaseService<DealEmailLog> {
  constructor(errorHandler: any) {
    super("DealEmailLog", "DealEmailLog", errorHandler);
  }

  postDealEmailLog(dealEmailLog: DealEmailLog, axiosCancel?: CancelTokenSource) {
    return this.postItemBySubURL( dealEmailLog, `EmailLog`);
  }
}
