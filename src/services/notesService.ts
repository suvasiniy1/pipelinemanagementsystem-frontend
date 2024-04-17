import { CancelTokenSource } from "axios";
import { Notes } from "../models/notes";
import { BaseService } from "./BaseService";

export class NotesService extends BaseService<Notes>{
    constructor(errorHandler: any){
        super("Notes", "Notes", errorHandler);
    }

    getNotes(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, `Notes/GetNotesByDeal/${dealId}`)
    }
}