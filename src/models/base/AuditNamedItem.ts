import { INamedItem, ISelectableNamedItem } from "./NamedItem";

export abstract class ItemBase {

    public abstract itemType: string ;

    getTypeName() { return this.constructor.name}

    // public  eqPropDel()
    // {
    //     let map = new Map<string, any>();
    //     Object.keys(this).forEach(e => map.set(e, this[e]));
    //     return map;
    // }
}
export interface IAuditableItem {

    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;

}

export abstract class NamedItem extends ItemBase implements INamedItem{
    
    id: number;
    name: string;
    desc: string;
    public abstract itemType: string ;
    constructor(id: number = 0, name: string = null as any, desc: string = null as any) {
        super();
        this.id = id;
        this.name = name;
        this.desc = desc;
       // this.itemType = this.constructor.name;
    }
}

export abstract class SelectedNamedItem extends NamedItem implements ISelectableNamedItem {
    public abstract itemType: string ;
    active!: string;
}

export abstract class AuditNamedItem extends SelectedNamedItem implements IAuditableItem {
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    public abstract itemType: string ;

    modifiedBy!: string;
    modifiedDate!: Date;
    convertedModifiedDate!: Date;

    constructor(id: number = 0,
        name: string = null as any,
        desc: string = null as any,
        createdBy: string = null as any,
        createdDate: Date = null as any,
        updatedBy: string = null as any,
        updatedDate: Date = null as any)
    {
        super(id, name, desc);
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedBy = updatedBy;
        this.updatedDate = updatedDate;
       
    }
 }

