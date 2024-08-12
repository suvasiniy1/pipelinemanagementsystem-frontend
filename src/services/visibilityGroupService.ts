import { CancelTokenSource } from "axios";
import { VisibilityGroup } from "../models/visibilityGroup";
import { BaseService } from "./BaseService";

export class VisibilityGroupService extends BaseService<VisibilityGroup> {
  constructor(errorHandler: any) {
    super("VisibilityGroup", "VisibilityGroup", errorHandler);
  }

}
