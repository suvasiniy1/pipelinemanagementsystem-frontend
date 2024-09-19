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
  // New properties with default values
  country: string = "UK";
  state: string | null = null; // State is set to null by default
  language: string = "English";
  timeZone: string = "(GMT +00:00) United Kingdom Time";
  profilePicture?: string; // Optional property
    // Add SecurityStamp and ConcurrencyStamp fields
    SecurityStamp: string = "";  // Default empty string or any other appropriate value
    ConcurrencyStamp: string = "";  // Default empty string or any other appropriate value
  constructor() {
      super();
      // Any additional initialization logic can go here
  }
}