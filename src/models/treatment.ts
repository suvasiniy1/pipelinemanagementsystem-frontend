import { AuditItem } from "./base/AuditNamedItem";

export class Treatment extends AuditItem {
  id!: number;
  treatmentID!: number;
  treatmentName!: string;
  category!:string;
}
