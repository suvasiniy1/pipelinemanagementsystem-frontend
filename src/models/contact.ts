import { AuditItem } from "./base/AuditNamedItem";

export class Contact extends AuditItem{
    id!:number;
    name!:string;
    firstName!: string;
    lastName!: string;
    organizationId!: number;
    emailMessageCount!: number;
    phone!: string;
    email!: string;
    marketingStatus!: boolean;
}