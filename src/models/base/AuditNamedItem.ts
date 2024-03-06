
export abstract class AuditItem {
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;

    constructor(
        createdBy: string = null as any,
        createdDate: Date = null as any,
        modifiedBy: string = null as any,
        modifiedDate: Date = null as any) {
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.modifiedBy = modifiedBy;
        this.modifiedDate = modifiedDate;

    }
}

