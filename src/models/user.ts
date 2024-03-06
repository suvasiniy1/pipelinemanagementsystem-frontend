import { AuditItem } from "./base/AuditNamedItem";

export class User extends AuditItem {
    itemType!: string;
    userName!: string;
    passwordHash!: string;
    userId!: number;
    email!: string;

    constructor(
        id: number = 0,
        name: string = "" as any,
        description: string = "" as any,
        createdBy: string,
        createdDate: Date,
        updatedBy: string,
        updatedDate: Date,
        itemType: string = null as any,
        userName: string = null as any,
        passwordHash: string = null as any,
        userId: number = null as any,
        email: string = null as any) {
        super(createdBy, createdDate, updatedBy, updatedDate)
        this.itemType = itemType;
        this.userName = userName;
        this.passwordHash = passwordHash;
        this.userId = userId;
        this.email = email;
    }
}