import { User } from "../models/user";
import { BaseService } from "./BaseService";

export class LoginService extends BaseService<User>{
    constructor(errorHandler: any) {
        super("Login", "Login", errorHandler);
    }
}