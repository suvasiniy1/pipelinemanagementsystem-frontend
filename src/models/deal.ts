import { AuditNamedItem } from "./base/AuditNamedItem";

export class Deal extends AuditNamedItem {
    itemType!: string;
    stageId!: number;
    pipeLineId!: number;
    userId!: number;
    personId!: number;
    status!: string;
    nextActivity!: Date;
    nextActivitySubject!: string;
    activitiesCount!: number;
    currency!: string;
    value!: number;
    weightedValue!: number;
    rottingInDays!: number;
    label!: string;
    productsCount!: number;
    person!: Array<any>;
    organization!: Array<any>;
    title:string  = "Sample Deal";

    constructor(id: number = 1,
        name: string = "Sample Deal" as any,
        desc: string = null as any,
        createdBy: string = null as any,
        createdDate: Date = null as any,
        updatedBy: string = null as any,
        updatedDate: Date = null as any,
        stageId: number = null as any,
        pipeLineId: number = null as any,
        status: string = null as any
    ) {
        super(id, name, desc, createdBy, createdDate, updatedBy, updatedDate);
        this.itemType = 'Stage';
        this.stageId = stageId;
        this.pipeLineId = pipeLineId;
        this.status = status;
    }

}