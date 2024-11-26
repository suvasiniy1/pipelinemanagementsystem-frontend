import { AuditItem } from "./base/AuditNamedItem";

export class Source extends AuditItem {
  id!: number;
  sourceID!: number;
  sourceName!: string;
}
