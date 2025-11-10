export class UserProfile {
  token!: string;
  user!: string; // Username
  password?: string;
  email!: string;
  userId!: number;
  firstName?: string; // Optional fields
  lastName?: string;  // Optional fields
  phoneNumber?: string; // Optional field
  role?: any;
  isactive!: boolean;
  visibilityGroupID!: number;
  expires!: string;
  country?: string; // Optional fields
  state?: string; // Optional fields
  language?: string; // Optional fields
  timeZone?: string; // Optional fields
  profilePicture?: string; // Optional field
  twoFactorRequired?: boolean;
  twoFactorEnabled?: boolean;
  concurrencyStamp?:string;
  securityStamp?:string;
  forcePasswordReset?:boolean;
  encryptedUserId?:string;
  encryptedToken?: string; 
}
