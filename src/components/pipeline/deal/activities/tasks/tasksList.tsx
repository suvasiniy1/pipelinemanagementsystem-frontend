import { useMsal } from "@azure/msal-react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Accordion, Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { DeleteDialog } from "../../../../../common/deleteDialog";
import { Tasks } from "../../../../../models/task";
import Util from "../../../../../others/util";
import { TaskService } from "../../../../../services/taskService";
import { loginRequest } from "../email/authConfig";
import {
  deleteCalendarEventToUser,
  deleteTask,
  getEventsList,
  getListTasksList,
  getTasksList,
  getUserDetails,
} from "../email/emailService";
import { TaskAddEdit } from "./taskAddEdit";
import TaskDetails from "./taskDetails";

type params = {
  dealId: number;
};
const TasksList = (props: params) => {
  const { dealId, ...others } = props;
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [tasksList, setTasksList] = useState<Array<Tasks>>([]);
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
  const [selectedTaskItem, setSelectedTaskItem] = useState<Tasks>();
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const taskSvc = new TaskService(ErrorBoundary);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if(accounts.length==0){
      handleLogin();
    }
    else{
      loadTasks();
    }
  }, [accounts]);

  const loadTasks = async () => {
    setIsLoading(true);
    let userGUIdsListForTodo:Array<string>=[];
    let userGUIdsListForEmail:Array<string>=[];
    taskSvc
      .getTasks(dealId)
      .then((res) => {
        (res as Array<Tasks>).forEach((i) => {
          i.updatedDate = i.updatedDate ?? i.createdDate;
          i.dueDate = Util.convertTZ(i.dueDate);
          i.reminder = Util.convertTZ(i.reminder);
          if(i.todo==="To Do"){
            if(!userGUIdsListForTodo.find(u=>u==i.userGUID)){
              userGUIdsListForTodo.push(i.userGUID);
            }
          }
          if(i.todo==="Email"){
            if(!userGUIdsListForEmail.find(u=>u==i.userGUID)){
              userGUIdsListForEmail.push(i.userGUID);
            }
          }
        });
        if(accounts?.length>0) syncTaskswithAzure(userGUIdsListForTodo, userGUIdsListForEmail, res);
        else setIsLoading(false);
      })
      .catch((err) => {
        setTasksList([]);
        setError(err);
        setIsLoading(false);
      });
  };

  /*Here we will validate each task whether it is exist or not in azure based on todo then will initiate delete operation*/
  
  const syncTaskswithAzure=async(userGUIdsList:Array<string>, userGUIdsListForEmail:Array<string>, tasksList:Array<Tasks>)=>{
    console.log("Syncing tasks and events with Azure");
    let token = await getAccessToken();
    let taskIdsTodelete:Array<number>=[];

    const azureTasksByUser = new Map<string, Array<any>>();
    const azureEventsByUser = new Map<string, Array<any>>();

    await Promise.all(userGUIdsList.map(async (userId) => {//For todo list
      let tasksListsByUser = await getListTasksList(token.accessToken, userId);
      let listId = tasksListsByUser?.value?.find(
        (t: any) => t.displayName === "Y1 Capital Tasks"
      )?.id;

      let tasksListForListId = await getTasksList(token.accessToken, userId, listId);
      if(tasksListForListId?.value) azureTasksByUser.set(userId, tasksListForListId?.value);
    }));

    await Promise.all(userGUIdsListForEmail.map(async (userId) => {//For calendar events list
      let eventsList = await getEventsList(token.accessToken, userId);
      if(eventsList?.value) azureEventsByUser.set(userId, eventsList?.value);
    }));

    tasksList.forEach((t, index)=>{
      let res:Array<any>=[];
      if(t.todo==="To Do"){
        res = azureTasksByUser.get(t.userGUID) as any;
      }
      if(t.todo==="Email"){
        res = azureEventsByUser.get(t.userGUID) as any;
      }

      if(res && !res?.find(r=>r.id==t.taskGUID)){
        taskIdsTodelete.push(t.taskId);
        tasksList.splice(index, 1);
      }
    })
    
    setTasksList(Util.sortList(tasksList, "updatedDate", "desc"));
    setIsLoading(false);

    if(taskIdsTodelete.length>0){
      console.log('Deleting tasks for given Ids '+JSON.stringify(taskIdsTodelete))
      taskSvc.deleteTasks(taskIdsTodelete);
    }
  }

  const getAccessToken = async () => {
    return await instance.acquireTokenSilent({
      scopes: ["Calendars.ReadWrite.Shared"], // Adjust scopes as per your requirements
      account: accounts[0],
    });
  };

  const continueTodelete = async () => {
    let token = await getAccessToken();
    let userGuId =
      selectedTaskItem?.userGUID ??
      (await getUserDetails(token.accessToken, selectedTaskItem?.assignedTo));
    let res =
      selectedTaskItem?.todo === "To Do"
        ? deleteTask(
            token.accessToken,
            userGuId,
            selectedTaskItem?.taskListGUID,
            selectedTaskItem?.taskGUID
          )
        : selectedTaskItem?.todo === "Email"
        ? deleteCalendarEventToUser(
            token.accessToken,
            userGuId,
            selectedTaskItem?.taskGUID
          )
        : null;
    if (res) {
      taskSvc
        .deleteTask(selectedTaskId)
        .then((res) => {
          toast.success("Task deleted successfully");
          setShowDeleteDialog(false);
          setSelectedTaskId(0);
          loadTasks();
        })
        .catch((err) => {});
    } else {
      toast.error("Unable to delete task");
    }
  };

  const handleLogin = async () => {
    try {
      let res = await instance.loginPopup(loginRequest);
      console.log("Login successful", res);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <div className="createnote-row">
            <>
              <div className="activityfilter-row pb-3">
                <div className="createnote-row">
                  <button
                    className="btn btn-y1app"
                    type="button"
                    onClick={(e: any) => {
                      setSelectedTaskItem(null as any);
                      setDialogIsOpen(true);
                    }}
                  >
                    Create Task
                  </button>
                </div>
              </div>
              {/* <h3>April 2024</h3> */}
              <div
                className="activityfilter-accrow  mb-3"
                hidden={tasksList.length == 0}
              >
                <Accordion className="activityfilter-acco">
                  {tasksList.map((task, index) => (
                    <div key={index}>
                      <TaskDetails
                        task={task}
                        index={index}
                        setDialogIsOpen={(e: any) => {
                          setDialogIsOpen(e);
                        }}
                        setShowDeleteDialog={(e: any) => {
                          setShowDeleteDialog(e);
                        }}
                        setSelectedTaskItem={(e: any) => {
                          setSelectedTaskItem(e);
                        }}
                        setSelectedTaskId={(e: any) => {
                          setSelectedTaskId(e);
                        }}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={(e: any) => {
                          setSelectedIndex(e);
                        }}
                      />
                    </div>
                  ))}
                </Accordion>
              </div>
              <div
                style={{ textAlign: "center" }}
                hidden={tasksList.length > 0}
              >
                No tasks are avilable to show
              </div>
            </>
        </div>
      )}
      {dialogIsOpen && (
        <TaskAddEdit
          dialogIsOpen={dialogIsOpen}
          dealId={dealId}
          taskItem={selectedTaskItem}
          setDialogIsOpen={setDialogIsOpen}
          onSaveTask={(e: any) => loadTasks()}
        />
      )}
      {showDeleteDialog && (
        <DeleteDialog
          itemType={"Task"}
          itemName={""}
          dialogIsOpen={showDeleteDialog}
          closeDialog={(e: any) => setShowDeleteDialog(false)}
          onConfirm={(e: any) => continueTodelete()}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      )}
    </>
  );
};

export default TasksList;
