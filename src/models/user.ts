import { AuditItem } from "./base/AuditNamedItem";

export class User extends AuditItem {
    userId!:number;
    userName!:string;
    email!: string;
    passwordHash!: string;
    role!:string;
    isActive!:boolean;
    visibilityGroupID!: number;
    visibilityGroupName?: string;
    lastLogin?: Date;
    confirmPassword!: string; 
}