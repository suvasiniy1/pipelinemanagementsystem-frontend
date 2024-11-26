import { AuditItem } from "./base/AuditNamedItem";

export class Clinic extends AuditItem {
  id!: number;
  clinicID!: number;
  clinicName!: string;
}
