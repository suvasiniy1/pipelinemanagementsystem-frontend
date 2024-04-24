import { CancelTokenSource } from "axios";
import { BaseService } from "./BaseService";
import { Comment } from "../models/comment";

export class CommentsService extends BaseService<Comment>{
    constructor(errorHandler: any){
        super("Comments", "Comments", errorHandler);
    }

    getComment(commentId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, `Comments/GetCommentById/${commentId}`)
    }

    deleteComment(commentId:number){
        return this.delete(commentId)
    }

    addComment(comment:Comment){
        return this.postItemBySubURL(comment, "AddComment");
    }
}