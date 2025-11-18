import { AuditItem } from "./base/AuditNamedItem";

export class UserPreferences extends AuditItem {
  public id: number = 0;
  public userId: number = 0;
  public gridName: string = "";
  public preferencesJson: string = "";
  public updatedBy: any;
  public updatedDate: Date;

  constructor(
    id: number = 0,
    userId: number = 0,
    gridName: string = "",
    preferencesJson: string = "",
    createdBy: number = 0,
    modifiedBy: number = 0
  ) {
    super();
    this.id = id;
    this.userId = userId;
    this.gridName = gridName;
    this.preferencesJson = preferencesJson;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.updatedBy = modifiedBy;
    this.createdDate = new Date();
    this.modifiedDate = new Date();
    this.updatedDate = new Date();
  }
}