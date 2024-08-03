import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class Tasks extends AuditItem{
    taskId!: number
    name!: string;
    startDate!:Date;
    dueDate!: Date
    reminder!: Date
    todo!: string
    priority!: string
    assignedTo!: number
    taskDetails!: string
    dealId!: number
    userName!:string
    comments!:Array<Comment>
    taskGUID!:string;
    taskListGUID!:string;
    userGUID!:string;
    transactionId!:string;
  }