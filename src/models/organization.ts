import { AuditItem } from "./base/AuditNamedItem";
export class Organization extends AuditItem{
    organizationID!: number
    name!: string
    labelID!: number
    ownerID!: number
    address!: string
    visibilityGroupID!: number
  }

  

