import { User } from "../models/user";
import { BaseService } from "./BaseService";

export class PasswordService extends BaseService<User> {
  constructor(errorHandler: any) {
    super("Password", "Password", errorHandler);
  }

  changePassword(item:any){
    return this.postItemBySubURL(item, "reset-password")
  }

  
  forgotPassword(item:any){
    return this.postItemBySubURL(item, "forgot-password")
  }
}
