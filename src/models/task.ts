import { AuditItem } from "./base/AuditNamedItem"
import { Comment } from "./comment"

export class Tasks extends AuditItem{
    taskId!: number
    name!: string;
    callType!: string;
    callDateTime!:Date;
    phone!: string; 
    startDate!:Date;
    dueDate!: Date | string; 
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
    duration!: number; // In hours
    email !:string;
    treatmentName!: string;
    personName!: string;
    type?: string;
    fromDate?: Date; // Add fromDate property
    toDate?: Date;   // Add toDate property

  }