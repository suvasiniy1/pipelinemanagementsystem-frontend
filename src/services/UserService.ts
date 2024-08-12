import { CancelTokenSource } from "axios";
import { User } from "../models/user";
import { IsMockService } from "../others/util";
import { BaseService } from "./BaseService";
import { VisibilityGroup } from "../models/visibilityGroup";

export class UserService extends BaseService<User> {
  constructor(errorHandler: any) {
    super("ManageUser", "ManageUser", errorHandler);
  }

  getUsers(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'ManageUser/GetUsers');
  }

  getUserById(userId: number, axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, IsMockService() ? 'mockData/users.json' : `User/${userId}`);
  }

  deleteUser(userId: number) {
    return this.delete(userId, `User/${userId}`);
  }
  
  getVisibilityGroups(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'VisibilityGroup/GetAllVisibilityGroupDetails');
}
}
