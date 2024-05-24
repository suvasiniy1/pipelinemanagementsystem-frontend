import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";
import { Task } from "../models/task";

export class TaskService extends BaseService<Task>{
    constructor(errorHandler: any){
        super("Tasks", "Tasks", errorHandler);
    }

    getTasks(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/tasks.json' : `Tasks/GetAllTask`)
    }

    deleteTask(taskId:number){
        return this.delete(taskId)
    }

}