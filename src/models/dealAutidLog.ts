import { AuditItem } from "./base/AuditNamedItem";

export class DealAuditLog extends AuditItem {
  auditId!: number;
  dealId!: number;
  eventType!: string;
  eventDescription!: string;
  eventDate!: string;
  userId!: number;
}

export class PostAuditLog extends AuditItem {
  auditId!: number;
  dealId!: number;
  eventType!: string;
  eventDescription!: string;
  eventDate!: string;
  userId!: number;
}
