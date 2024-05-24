import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class Task extends AuditItem{
    taskId!: number
    name!: string
    dueDate!: Date
    reminder!: Date
    todo!: string
    priority!: string
    assignedTo!: number
    taskDetails!: string
    dealId!: number
    userName!:string
    comments!:Array<Comment>
  }