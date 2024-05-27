import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class emailTemplate extends AuditItem {
    TemplateID!: number
    TemplateName!: string
    TemplateBody!:string
    CategoryId!:string
    userID!: number
    createdBy!: number
    modifiedBy!: number
    userName!:string    
  }