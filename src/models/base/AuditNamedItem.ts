
export abstract class AuditItem {
    createdBy: any;
    createdDate: Date;
    modifiedBy: any;
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

