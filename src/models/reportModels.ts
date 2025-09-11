import { AuditItem } from "./base/AuditNamedItem";

export interface ReportCondition {
  id: number;
  reportDefinitionId: number;
  field: string;
  operator: string;
  value: string;
  extraValue?: string;
}

export class CreateReportRequest extends AuditItem {
  id!: number;
  name!: string;
  chartType!: string;
  frequency!: string;
  isPreview!: boolean;
  isActive!: boolean;
  isPublic!: boolean;
  reportConditions!: ReportCondition[];
}

export interface ReportDefinition {
  id: number;
  name: string;
  chartType: string;
  frequency: string;
  isPreview: boolean;
  isActive: boolean;
  isPublic: boolean;
  reportConditions: ReportCondition[];
  createdDate: string;
  createdBy: number;
  modifiedBy: number;
  modifiedDate: string;
}