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
        return this.getItems(axiosCancel, IsMockService() ? 'mockData/tasks.json' : `Tasks/GetTasksByDeal/${dealId}`)
    }
 
    getAllTasks(): Promise<Array<Tasks>> {
        return this.getItems(undefined, "Tasks/GetAllTask"); // Adjust the URL as necessary
    }
    deleteTask(taskId:number){
        return this.delete(taskId)
    }

    deleteTasks(taskIds:Array<number>){
        return this.postItemBySubURL(taskIds, "DeleteTaskList");
    }

    addorUpdateTask(task:Tasks){
        return task.taskId > 0
        ? this.putItemBySubURL(task, IsMockService() ? "mockData/tasks.json" : `${task.taskId}`)
        : this.postItemBySubURL(task, IsMockService() ? "mockData/tasks.json" : "AddTask");
    }
}