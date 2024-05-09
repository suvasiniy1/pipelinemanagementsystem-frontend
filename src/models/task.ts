import { AuditItem } from "./base/AuditNamedItem"

export class Task extends AuditItem{
    taskId!: number
    name!: string
    dueDate!: string
    reminder!: number
    todo!: string
    priority!: string
    assignedTo!: number
    taskDetails!: string
    dealId!: number
  }