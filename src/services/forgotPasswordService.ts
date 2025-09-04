import { CancelTokenSource } from "axios";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util"; // Util function to check if it's mock service

export class ForgotPasswordService extends BaseService<any> {
    constructor(errorHandler: any) {
        super("Password", "Password", errorHandler); // Points to the PasswordController
    }

    // Sends the password reset link
    sendResetLink(emailID: string, axiosCancel?: CancelTokenSource) {
        const url = IsMockService() ? 'mockData/forgotPassword.json' : `forgot-password`;
        return this.postItemBySubURL({ emailID }, url, null as any, true, axiosCancel);
    }

    // Resets the password using the provided token and new password
    resetPassword(token: string, username: string, password: string, axiosCancel?: CancelTokenSource) {
        const url = IsMockService() ? 'mockData/resetPassword.json' : `reset-password`;
        return this.postItemBySubURL({ token, username, password }, url, null as any, true, axiosCancel);
    }
    validateReset(usernameOrUserId: string, token: string, axiosCancel?: any) {
  const qs = new URLSearchParams({ username: usernameOrUserId, token }).toString();
  return this.getItemsBySubURL(`validate-reset?${qs}`, axiosCancel); // add GET helper if needed
}
}
