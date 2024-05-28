import React, { useEffect, useState } from "react";
import { TaskAddEdit } from "./taskAddEdit";
import { Accordion, Spinner } from "react-bootstrap";
import DealNoteDetails from "../notes/noteDetails";
import { AxiosError } from "axios";
import { Tasks } from "../../../../../models/task";
import TaskDetails from "./taskDetails";
import { TaskService } from "../../../../../services/taskService";
import { ErrorBoundary } from "react-error-boundary";
import Util from "../../../../../others/util";
import { toast } from "react-toastify";
import { DeleteDialog } from "../../../../../common/deleteDialog";

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

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    
    setIsLoading(true);
    taskSvc
      .getTasks(dealId)
      .then((res) => {
        
        (res as Array<Tasks>).forEach((i) => {
          i.updatedDate = i.updatedDate ?? i.createdDate;
        });
        setTasksList(Util.sortList(res, "updatedDate", "desc"));
        setIsLoading(false);
      })
      .catch((err) => {
        setTasksList([]);
        setError(err);
        setIsLoading(false);
      });
  };

  const deleteTask = () => {
    taskSvc
      .deleteTask(selectedTaskId)
      .then((res) => {
        toast.success("Task deleted successfully");
        setShowDeleteDialog(false);
        setSelectedTaskId(0);
        loadTasks();
      })
      .catch((err) => {});
  };

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="activityfilter-row pb-3">
            <div className="createnote-row">
              <button
                className="btn btn-primary"
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
          <h3>April 2024</h3>
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
          <div style={{ textAlign: "center" }} hidden={tasksList.length > 0}>
            No tasks are avilable to show
          </div>
        </>
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
          onConfirm={(e: any) => deleteTask()}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      )}
    </>
  );
};

export default TasksList;
