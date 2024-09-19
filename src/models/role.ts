import { AuditItem } from "./base/AuditNamedItem";
export class Role extends AuditItem{
    id!: number;   // Updated to match the backend
    name!: string; // Updated to match the backend
    normalizedName!: string;
    concurrencyStamp!: string;
   
}
