import { CancelTokenSource } from "axios";
import { Stage } from "../models/stage";
import { BaseService } from "./BaseService";
import { IsMockService } from "../others/util";
import { Tasks } from "../models/task";

export class TaskService extends BaseService<Tasks>{
    constructor(errorHandler: any){
        super("Tasks", "Tasks", errorHandler);
    }

    getTasks(dealId:number, axiosCancel?: CancelTokenSource){
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/tasks.json' : `Tasks/GetAllTask`)
    }

    deleteTask(taskId:number){
        return this.delete(taskId)
    }
    addTask(task:Tasks){
        return this.postItemBySubURL(task, "AddTask");
    }
}