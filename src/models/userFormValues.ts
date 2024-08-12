export interface UserFormValues {
    userName: string;
    email: string;
    passwordHash: string;
    confirmPassword: string;
    role: string;
    isActive: boolean;
    visibilityGroupID: number;
}