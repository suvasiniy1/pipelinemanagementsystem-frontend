import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class Tasks extends AuditItem{
    taskId!: number
    name!: string
<<<<<<< HEAD
    dueDate!: Date
    reminder!: Date
=======
    dueDate!: string
    reminder!: string
>>>>>>> afa03462e0f7e66dea76be1692007f9928caf444
    todo!: string
    priority!: string
    assignedTo!: number
    taskDetails!: string
    dealId!: number
    userName!:string
    comments!:Array<Comment>
  }