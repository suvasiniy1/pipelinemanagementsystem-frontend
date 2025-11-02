import { AuditItem } from "./base/AuditNamedItem";

export class DealAuditLog extends AuditItem {
  auditId!: number;
  dealId!: number;
  eventType!: string;
  eventDescription!: string;
  eventDate!: string;
  userId!: number;
  userName!: string;
}

export class PostAuditLog extends AuditItem {
  auditId!: number;
  dealId!: number;
  eventType!: string;
  eventDescription!: string;
  eventDate!: string;
  userId!: number;
}

export class DealEmailLog extends AuditItem{
  id!: number;
  dealId!: number;
  emailTo!: string;
  emailBody!: string;
  emailDate!: Date;
}

