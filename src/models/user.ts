import { AuditItem } from "./base/AuditNamedItem";

export class User extends AuditItem {
    userId!:number;
    userName!:string;
    firstName!:string;
    lastName!:string;
    email!: string;
    phoneNumber!:string
    passwordHash!: string;
    roleId!: number;
    isActive!:boolean;
    organizationId!: number;
    name!:string;
    roleName!:string;
    lastLogin?: Date;
    confirmPassword!: string; 
  
}