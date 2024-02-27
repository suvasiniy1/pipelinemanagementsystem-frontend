import { AuditNamedItem } from "./base/AuditNamedItem";
import { Deal } from "./deal";
import { colors } from "@atlaskit/theme";

export class Stage extends AuditNamedItem {
    itemType!: string;
    order!: number;
    probability!: number;
    rottingInDays!: number;
    deals: Array<Deal> = [];
    title!: string;
    colors = {
        soft: colors.Y50,
        hard: colors.N400A,
    };

    constructor(id: number = 0,
        name: string = null as any,
        desc: string = null as any,
        createdBy: string = null as any,
        createdDate: Date = null as any,
        updatedBy: string = null as any,
        updatedDate: Date = null as any,
        title: string = null as any,
        order: number = null as any,
        probability: number = null as any,
        rottingInDays: number = null as any
    ) {
        super(id, name, desc, createdBy, createdDate, updatedBy, updatedDate);
        this.itemType = 'Stage';
        this.title = title;
        this.order = order;
        this.probability = probability;
        this.rottingInDays = rottingInDays;
    }
}