import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class Notes extends AuditItem {
    noteID!: number
    dealID!: number
    noteDetails!: string
    userID!: number
    createdBy!: number
    modifiedBy!: number
    userName!:string
    comments!:Array<Comment>
  }