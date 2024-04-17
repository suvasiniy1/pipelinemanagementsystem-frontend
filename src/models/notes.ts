import { AuditItem } from "./base/AuditNamedItem"

export class Notes extends AuditItem {
    noteID!: number
    dealID!: number
    noteDetails!: string
    userID!: number
    createdBy!: number
    modifiedBy!: number
    userName!:string
  }