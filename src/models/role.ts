import { AuditItem } from "./base/AuditNamedItem";
export class Role extends AuditItem{
    roleId!: number;  // Update to match API response
    roleName!: string;
   
}
