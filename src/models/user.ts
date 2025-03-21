import { AuditItem } from "./base/AuditNamedItem";

export class User extends AuditItem {
    Id!:number;
    userId!:number;
    userName!:string;
    firstName!:string;
    lastName!:string;
    email!: string;
    phoneNumber!:string
    passwordHash?: string;
    roleId!: number;
    isActive!:boolean;
    organizationId!: number;
    name!:string;
    roleName!:string;
    lastLogin?: Date;
    confirmPassword?: string; 
  // New properties with default values
  country: string = "UK";
  state: string | null = null; // State is set to null by default
  language: string = "English";
  timeZone: string = "(GMT +00:00) United Kingdom Time";
  profilePicture?: string; // Optional property
    // Add SecurityStamp and ConcurrencyStamp fields
   // Identity fields (essential for updates)
   emailConfirmed: boolean = true; 
   twoFactorEnabled: boolean = false;
   securityStamp: string = ""; 
   concurrencyStamp: string = ""; 
   normalizedEmail: string = ""; 
   normalizedUserName: string = ""; 
  constructor() {
      super();
      // Any additional initialization logic can go here
  }
}