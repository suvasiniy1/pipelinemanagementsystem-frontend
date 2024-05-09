import { CancelTokenSource } from "axios";
import { Notes } from "../models/notes";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";

export class NotesService extends BaseService<Notes>{
    constructor(errorHandler: any){
        super("Notes", "Notes", errorHandler);
    }

    getNotes(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/notes.json' : `Notes/GetNotesByDeal/${dealId}`)
    }

    deleteNote(noteId:number){
        return this.delete(noteId)
    }
}