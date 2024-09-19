import { CancelTokenSource } from "axios";
import { BaseService } from "./BaseService";


export class AccountService extends BaseService<any> {
    constructor(errorHandler: any) {
        super("account", "Account", errorHandler);
      }
    enableTwoFactorAuthentication(axiosCancel?: CancelTokenSource) {
        return this.postItemBySubURL({}, "enable-2fa", false, false, axiosCancel);
      }
}