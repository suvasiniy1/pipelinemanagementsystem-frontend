import { AuditItem } from "./base/AuditNamedItem";

export class Clinic extends AuditItem {
    clinicID!: number
    clinicName!: string
  }