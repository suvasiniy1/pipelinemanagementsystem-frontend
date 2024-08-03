import { useMsal } from "@azure/msal-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { AddEditDialog } from "../../../../../common/addEditDialog";
import GenerateElements from "../../../../../common/generateElements";
import { ElementType, IControl } from "../../../../../models/iControl";
import { Tasks } from "../../../../../models/task";
import { Utility } from "../../../../../models/utility";
import LocalStorageUtil from "../../../../../others/LocalStorageUtil";
import Constants from "../../../../../others/constants";
import Util from "../../../../../others/util";
import { TaskService } from "../../../../../services/taskService";
import {
  addCalendarEventToUser,
  createTask,
  createTasksList,
  getEventsList,
  getListTasksList,
  getTasksList,
  getUserDetails,
  updateCalendarEventToUser,
  updateTask
} from "../email/emailService";

type params = {
  dealId: number;
  dialogIsOpen: any;
  setDialogIsOpen: any;
  onSaveTask?: any;
  taskItem?: Tasks;
  onCloseDialog?: any;
};

export const TaskAddEdit = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen, dealId, taskItem, ...Others } = props;
  const [selectedItem, setSelectedItem] = useState(taskItem ?? new Tasks());
  const [isLoading, setIsLoading] = useState(false);
  const typesList = ["To Do", "Call", "Email"];
  const prioritiesList = ["High", "Normal", "Low"];
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );
  const taskSvc = new TaskService(ErrorBoundary);
  const { instance, accounts } = useMsal();
  const [taskItemObj, setTaskItemObj] = useState<any>({});
  const [accessToken, setAccessToken] = useState();
  const [userGuID, setUserGuID] = useState();

  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "name",
      isRequired: true,
      sidebyItem: "Assigned To",
    },
    {
      key: "Due Date",
      value: "dueDate",
      type: ElementType.datepicker,
      sidebyItem: "Reminder",
      isRequired: true,
      showTimeSelect: true,
    },
    {
      key: "Reminder",
      value: "reminder",
      type: ElementType.datepicker,
      isRequired: true,
      isSideByItem: true,
      showTimeSelect: true,
    },
    {
      key: "Type",
      value: "todo",
      type: ElementType.dropdown,
      sidebyItem: "Priority",
      isRequired: true,
    },
    {
      key: "Priority",
      value: "priority",
      type: ElementType.dropdown,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "Assigned To",
      value: "assignedTo",
      type: ElementType.dropdown,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "Task Details",
      value: "taskDetails",
      type: ElementType.ckeditor,
      isRequired: true,
      elementSize: 12,
      hideLabel: true,
    },
  ];

  useEffect(() => {
    if (taskItem) {
      setValue("dueDate" as never, taskItem.dueDate as never);
      setValue("reminder" as never, taskItem.reminder as never);
      setValue("taskDetails" as never, taskItem.taskDetails as never);
      setUserGuID(taskItem.userGUID as any);
    }
  }, [taskItem]);

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken && taskItem?.taskGUID) {
      let res = taskItem.todo==="To Do" ?  getTaskDetails() : taskItem.todo==="Email" ? getEventDetails() : null;
    } else {
      setTaskItemObj({
        ...taskItemObj,
        startDateTime: {
          dateTime: new Date(),
          timeZone: "India Standard Time",
        },
      });
    }
  }, [accessToken]);

  const getEventDetails=async () => {
    
    let userGUID = taskItem?.userGUID ?? await getUserDetails(accessToken, taskItem?.assignedTo);
    setUserGuID(userGuID);
    let tasksList = await getEventsList(
      accessToken,
      userGUID
    );

    setTaskItemObj(
      tasksList?.value?.find((i: any) => i.id === taskItem?.taskGUID)
    );
  };

  const getTaskDetails = async () => {
    let userGUID = taskItem?.userGUID ?? await getUserDetails(accessToken, taskItem?.assignedTo);
    setUserGuID(userGuID);
    let tasksList = await getTasksList(
      accessToken,
      userGUID,
      taskItem?.taskListGUID
    );

    setTaskItemObj(
      tasksList?.value?.find((i: any) => i.id === taskItem?.taskGUID)
    );
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
    props.onCloseDialog && props.onCloseDialog();
  };

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList)),
  };
  const methods = useForm(formOptions);
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const getAccessToken = async () => {
    let res = await instance.acquireTokenSilent({
      scopes: ["Calendars.ReadWrite.Shared"], // Adjust scopes as per your requirements
      account: accounts[0],
    });

    setAccessToken(res?.accessToken as any);
  };

  function getDurationInMinutes(startDate: any, endDate: any) {
    // Convert dates to milliseconds
    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime();

    // Calculate difference in milliseconds
    const diffMillis = Math.abs(endMillis - startMillis);

    // Convert milliseconds to minutes
    const durationMinutes = Math.ceil(diffMillis / (1000 * 60));

    return durationMinutes;
  }

  const initiateactioninAzure = async (task: Tasks) => {
    
    let userGuId;
    if (!userGuID) {
      userGuId = await getUserDetails(accessToken, task.assignedTo);
      setUserGuID(userGuId as any);
    } else {
      userGuId = userGuID;
    }

    if (userGuId) {
      if (task.todo === "To Do") {
        let res = await performActionForTask(
          task,
          accessToken as any,
          userGuId
        );
        return res;
      }
      
      if (task.todo === "Email") {
        let res = await performActionForEmail(
          task,
          accessToken as any,
          userGuId
        );
        return res;
      }
    }
  };

  const performActionForTask = async (
    task: Tasks,
    accessToken: string,
    userId: any
  ) => {
    let taskListId = task.taskListGUID;
    if (!taskListId) {
      let tasksList = await getListTasksList(accessToken, userId);
      taskListId = tasksList?.value?.find(
        (t: any) => t.displayName === "Y1 Capital Tasks"
      )?.id;

      if (!taskListId) taskListId = await createTasksList(accessToken, userId);
    }
    if (taskListId) {
      task.taskListGUID = taskListId;

      const taskObj = {
        id: taskItemObj?.id,
        title: task.name,
        body: {
          content: task.taskDetails,
          contentType: "html",
        },
        status: "inProgress",
        startDateTime: task.startDate ?? {
          dateTime: new Date(),
          timeZone: "India Standard Time",
        },
        dueDateTime: {
          dateTime: task.dueDate,
          timeZone: "India Standard Time",
        },
        reminderDateTime: {
          dateTime: task.reminder,
          timeZone: "India Standard Time",
        },
        importance: task.priority.toLocaleLowerCase(),
        isReminderOn: !Util.isNullOrUndefinedOrEmpty(task.reminder),
      };

      try {
        const response = await (taskItemObj.id
          ? updateTask(accessToken, userId, taskListId, taskObj)
          : createTask(accessToken, userId, taskListId, taskObj));
        if (response) {
          setTaskItemObj({ ...taskItemObj, id: response });
        }
        return response;
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const performActionForEmail = async (
    task: Tasks,
    accessToken: string,
    userId: any
  ) => {
    const taskObj = {
      subject: task.name,
      importance: "normal",
      body: {
        contentType: "HTML",
        content: task.taskDetails,
      },
      start: task.startDate ?? {
        dateTime: new Date(),
        timeZone: "India Standard Time",
      },
      end: {
        dateTime: task.dueDate,
        timeZone: "India Standard Time",
      },
      attendees: [
        {
          emailAddress: {
            address: task.assignedTo,
            name: "Test",
          },
          type: "required",
        },
      ],
      allowNewTimeProposals: true,
      transactionId: taskItemObj.transactionId ?? uuidv4(),
    };

    try {
      const response = await (taskItemObj.id
        ? updateCalendarEventToUser(accessToken, userId, taskObj, taskItemObj.id)
        : addCalendarEventToUser(accessToken, userId, taskObj));
      if (response) {
        setTaskItemObj({ ...taskItemObj, id: response });
      }
      return response;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const onSubmit = (item: any) => {
    let addUpdateItem: Tasks = new Tasks();
    addUpdateItem.createdBy = Util.UserProfile()?.userId;
    addUpdateItem.modifiedBy = Util.UserProfile()?.userId;
    addUpdateItem.createdDate = new Date();
    Util.toClassObject(addUpdateItem, item);
    addUpdateItem.dealId = dealId;
    addUpdateItem.startDate = taskItemObj?.startDateTime;
    addUpdateItem.taskId = taskItemObj?.id ?? (0 as any);
    addUpdateItem.dueDate = new Date(addUpdateItem.dueDate);
    addUpdateItem.reminder = new Date(addUpdateItem.reminder);
    console.log("addUpdateItem" + { ...addUpdateItem });

    if (new Date(addUpdateItem.reminder) < new Date()) {
      toast.warning("Reminder cannot be lesser than current date");
      return;
    }
    if (new Date(addUpdateItem.reminder) > new Date(addUpdateItem.dueDate)) {
      toast.warning("Reminder cannot be greater than due date");
      return;
    }

    initiateactioninAzure(addUpdateItem).then((res) => {
      if (res) {
        let tasks =
          JSON.parse(LocalStorageUtil.getItemObject("tasksList") as any) ?? [];
        addUpdateItem.taskGUID = res;
        addUpdateItem.taskId = tasks.length + 1;
        addUpdateItem.userGUID = userGuID as any;
        let index = tasks.findIndex((i: any) => i.taskGUID === res);
        if (index != -1) {
          tasks[index] = addUpdateItem;
        } else {
          tasks.push(addUpdateItem);
        }

        LocalStorageUtil.setItemObject("tasksList", JSON.stringify(tasks));
        setDialogIsOpen(false);
        toast.success(
          taskItemObj.id
            ? "Task updated successfully"
            : "Task created successfully"
        );
        props.onSaveTask();
        // addUpdateItem.taskGUID=res;
        // taskSvc.addorUpdateTask(addUpdateItem).then((res) => {
        //   debugger
        //   setDialogIsOpen(false);
        //   props.onSaveTask();
        //   if (res) {
        //     toast.success(
        //       `Task ${addUpdateItem.taskId > 0 ? "updated" : "added"} successfully`
        //     );
        //   } else {
        //     toast.error("Unable to add Task");
        //   }
        // });
      }
    });
    return;
  };

  const getDropdownvalues = (item: any) => {
    if (item.key === "Type") {
      return typesList.map((i: any) => ({ name: i, value: i })) ?? [];
    }
    if (item.key === "Priority") {
      return prioritiesList.map((i: any) => ({ name: i, value: i })) ?? [];
    }
    if (item.key === "Assigned To") {
      return (
        [
          {
            personName: "Test",
            personID: "Testtest@transforminglives.co.uk",
          },
        ]?.map(({ personName, personID }) => ({
          name: personName,
          value: personID,
        })) ?? []
      );
    }
  };

  const onChange = (value: any, item: any) => {
    setValue(item.value as never, value as never);
    if (value) unregister(item.value as never);
    else register(item.value as never);
    resetField(item.value as never);

    if (item.key === "Due Date") {
      setSelectedItem({ ...selectedItem, dueDate: value });
    }
    if (item.key === "Reminder") {
      setSelectedItem({ ...selectedItem, reminder: value });
    }
    if (item.key === "Task Details") {
      setSelectedItem({ ...selectedItem, taskDetails: value });
    }
  };
  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={"Add Task"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
          >
            <>
              {isLoading && (
                <div className="alignCenter">
                  <Spinner />
                </div>
              )}
              <div className="modelformfiledrow row">
                <div>
                  <div className="modelformbox ps-2 pe-2">
                    {
                      <GenerateElements
                        controlsList={controlsList}
                        selectedItem={selectedItem}
                        onChange={(value: any, item: any) =>
                          onChange(value, item)
                        }
                        getListofItemsForDropdown={(e: any) =>
                          getDropdownvalues(e) as any
                        }
                      />
                    }
                    <br />
                  </div>
                </div>
              </div>
            </>
            {/* <SelectDropdown isValidationOptional={true} 
                                item={selectedItem} 
                                selectedItem={selectedItem} 
                                list={getDueDates()}/> */}
            {/* <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                    value={selectedItem.noteDetails} /> */}
            <br />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};
