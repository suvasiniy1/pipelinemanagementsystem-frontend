export interface UserFormValues {
    userName: string;
    email: string;
    passwordHash: string;
    confirmPassword: string;
    phoneNumber:string;
    roleID: number; // Make this field nullable
    isActive: boolean;
    organizationID: number; // Make this field nullable
}