import { AuditItem } from "./base/AuditNamedItem";

export class Campaign extends AuditItem {
  id!: number;
  name!: string;
  color!: string;
  owner!: number;
  startDate!: Date;
  endDate!: Date;
  goal!: string;
  audience!: string;
  notes!: string;

  constructor(
    id: number = null as any,
    name: string = null as any,
    color: string = null as any,
    owner: number = null as any,
    startDate: Date = null as any,
    endDate: Date = null as any,
    goal: string = null as any,
    audience: string = null as any,
    notes: string = null as any
  ) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
    this.owner = owner;
    this.startDate = startDate;
    this.endDate = endDate;
    this.goal = goal;
    this.audience = audience;
    this.notes = notes;
  }
}

export class CampaignAssets{
    campaignId!:number;
    assetId!:number;
    assetType!:AssetType;
    items!:Array<any>
}

export enum AssetType {
  Email = 1,
  Task = 2
}
