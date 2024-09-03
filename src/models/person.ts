import { AuditItem } from "./base/AuditNamedItem";

export class Person extends AuditItem {
    personID!: number
    personName!: string
    phone!: string
    email!: string
    firstName!: string
    lastName!: string
    organizationID!: number
    labelID!: number
    ownerID!: number
    clinicID!: number
    sourceID!: number
    visibilityGroupID!: number
    userName!: string
    openDeals!: number
    closedDeals!: number 
  }