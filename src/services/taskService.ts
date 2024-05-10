import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";
import { Task } from "../models/task";

export class TaskService extends BaseService<Task>{
    constructor(errorHandler: any){
        super("Task", "Task", errorHandler);
    }

    getTasks(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/tasks.json' : `Tasks/GetTasksByDeal/${dealId}`)
    }

    deleteTask(taskId:number){
        return this.delete(taskId)
    }

}