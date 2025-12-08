import { AuditItem } from './base/AuditNamedItem';

export class Tenant extends AuditItem {
  id!: number;
  name!: string;
  isActive!: boolean;
  connectionString?: string;
  tenantKey?: string;
  theamCode?: string;
  logo?: string;
  emailCLinetId?: string;
  port?: string;
  smtpUsername?: string;
  smtpPassword?: string;
}

export interface TenantFormValues {
  id?: number;
  name: string;
  isActive: boolean;
  connectionString?: string;
  tenantKey?: string;
  theamCode?: string;
  logo?: string;
  emailCLinetId?: string;
  port?: string;
  smtpUsername?: string;
  smtpPassword?: string;
}