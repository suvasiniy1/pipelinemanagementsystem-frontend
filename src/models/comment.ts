import { AuditItem } from "./base/AuditNamedItem";

export class Comment extends AuditItem{
    commentId!: number;
    comment!: string;
    dealID!: number;
    noteId!: number;
    taskId!:number;
}