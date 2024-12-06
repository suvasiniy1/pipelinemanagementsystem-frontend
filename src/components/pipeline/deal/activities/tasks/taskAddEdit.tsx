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
  deleteTask,
  getEventsList,
  getListTasksList,
  getTasksList,
  getUserDetails,
  updateCalendarEventToUser,
  updateTask,
} from "../email/emailService";
import { PostAuditLog } from "../../../../../models/dealAutidLog";
import { DealAuditLogService } from "../../../../../services/dealAuditLogService";
import 'react-calendar/dist/Calendar.css';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserService  } from "../../../../../services/UserService";
import { User } from "../../../../../models/user";
import { DealService } from "../../../../../services/dealService";


type params = {
  dealId: number;
  dialogIsOpen: any;
  setDialogIsOpen: any;
  onSaveTask?: any;
  taskItem?: Tasks | null;
  onCloseDialog?: any;
};

const typesList = ["Call", "Meeting", "Task"]; // Activity Types
interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string };
  end: { dateTime: string };
}
interface FormattedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}
const fetchDealDetails = async (dealId: number) => {
  // Replace this with an API call to fetch deal details by dealId
  const response = await fetch(`/api/deals/${dealId}`);
  if (!response.ok) throw new Error("Failed to fetch deal details");
  return response.json(); // Assume API returns { treatmentName: string, personName: string }
};
export const TaskAddEdit = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen, dealId, taskItem, ...Others } = props;
  const [selectedItem, setSelectedItem] = useState(taskItem ?? new Tasks());
  const [activityType, setActivityType] = useState("Call"); // Default activity type
  const [isLoading, setIsLoading] = useState(false);
  const typesList = ["To Do", "Email"];
  const prioritiesList = ["High", "Normal", "Low"];
  const activityList = [
    { name: "Call", value: "Call" },
    { name: "Email", value: "Email" },
    { name: "Meeting", value: "Meeting" },
  ];
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );
  const taskSvc = new TaskService(ErrorBoundary);
  const { instance, accounts } = useMsal();
  const [taskItemObj, setTaskItemObj] = useState<any>({});
  const [accessToken, setAccessToken] = useState();
  const [userGuID, setUserGuID] = useState();
  const auditLogsvc = new DealAuditLogService(ErrorBoundary);
  const localizer = momentLocalizer(moment);
  const [calendarEvents, setCalendarEvents] = useState<FormattedEvent[]>([]);
  const userService = new UserService(ErrorBoundary); 
  const [owners, setOwners] = useState<Array<{ name: string; value: string }>>([]);
  const [treatmentName, setTreatmentName] = useState<string>("");
  const [personName, setPersonName] = useState<string>("");
  const dealSvc = new DealService(ErrorBoundary); // Initialize DealService

  const controlsList: Array<IControl> = [
    {
      key: "Type",
      value: "todo",
      type: ElementType.dropdown,
      isRequired: true,
      sidebyItem: "Name",
    },
    {
      key: "Name",
      value: "name",
      type: ElementType.dropdown,
      isRequired: true,
      isSideByItem: true,
    },
    {
      key: "From Date",
      value: "fromDate",
      type: ElementType.datepicker,
      sidebyItem: "To Date",
      isRequired: true,
      showTimeSelect: true,
    },
    {
      key: "To Date",
      value: "toDate",
      type: ElementType.datepicker,
      isRequired: true,
      isSideByItem: true,
      showTimeSelect: true,
    },
    {
      key: "Priority",
      value: "priority",
      type: ElementType.dropdown,
      isRequired: true,
    },
    {
      key: "Task Details",
      value: "taskDetails",
      type: ElementType.ckeditor,
      isRequired: true,
      elementSize: 12,
      hideLabel: true,
    },
    {
      key: "Assigned To",
      value: "assignedTo",
      type: ElementType.dropdown,
      isRequired: true,
    },
    {
      key: "Treatment",
      value: "treatmentName",
      type: ElementType.textbox,
      isRequired: true,
    },
    // New text box for person's name
    {
      key: "Person Name",
      value: "personName",
      type: ElementType.textbox,
      isRequired: false,
    },
  ];
  useEffect(() => {
    if (taskItem) {
      setValue("fromDate" as never, taskItem.fromDate as never);
      setValue("toDate" as never, taskItem.toDate as never);
      setValue("taskDetails" as never, taskItem.taskDetails as never);
      setValue("treatmentName" as keyof Tasks, taskItem.treatmentName ?? "" as never); // Default treatment
      setValue("personName" as keyof Tasks, taskItem.personName ?? "" as never); 
      setUserGuID(taskItem.userGUID as any);
    }
  }, [taskItem]);

  useEffect(() => {
    getAccessToken();
  }, []);
  useEffect(() => {
    if (accessToken) {
      fetchCalendarEvents();
    }
  }, [accessToken]);
  //useEffect(() => {
    //setValue("name", activityType); // Update the "name" field with selected activity type
  //}, [activityType]);
  
  useEffect(() => {
    if (accessToken && taskItem?.taskGUID) {
      let res =
        taskItem.todo === "To Do"
          ? getTaskDetails()
          : taskItem.todo === "Email"
          ? getEventDetails()
          : null;
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
  
  

  const getEventDetails = async () => {
    let userGUID =
      taskItem?.userGUID ??
      (await getUserDetails(accessToken, taskItem?.assignedTo));
    setUserGuID(userGuID);
    let tasksList = await getEventsList(accessToken, userGUID);

    setTaskItemObj(
      tasksList?.value?.find((i: any) => i.id === taskItem?.taskGUID)
    );
  };

  const getTaskDetails = async () => {
    let userGUID =
      taskItem?.userGUID ??
      (await getUserDetails(accessToken, taskItem?.assignedTo));
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
  const otherDefaultValues = {
    // Add your necessary default field values here
    priority: "Normal",
    todo: "To Do",
};
  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList)),
  };
  const methods = useForm<Tasks>({
    defaultValues: {
       // type: "Call",
        fromDate: new Date(), // Default dueDate value
        toDate: new Date(), // Default reminder value
        name: "Call", // Ensure all required fields are initialized
        assignedTo: 0, // Initialize assignedTo with a default ID
        taskDetails: "",
        treatmentName: "", // Default for treatment
        personName: "", // Default for person name
        ...otherDefaultValues, // If declared or imported
    },
});
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const getAccessToken = async () => {
    try {
    let res = await instance.acquireTokenSilent({
      scopes: ["Calendars.ReadWrite.Shared"], // Adjust scopes as per your requirements
      account: accounts[0],
    });

    setAccessToken(res?.accessToken as any);
  } catch (error) {
    console.error("Error acquiring token:", error);
    toast.error("Unable to acquire access token.");
    throw error;
  }
  };
  // Fetch Events for Calendar
  const fetchCalendarEvents = async () => {
    try {
      if (!accessToken || !userGuID) {
        console.error("AccessToken or User GUID is missing.");
        return;
      }
      const events: CalendarEvent[] = await getEventsList(accessToken); // Ensure the correct type is used here
      const formattedEvents: FormattedEvent[] = events.map((event: CalendarEvent) => ({
        id: event.id,
        title: event.subject,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
      }));
      setCalendarEvents(formattedEvents); // TypeScript should now recognize this as valid
    } catch (error) {
      console.error("Error fetching events", error);
    }
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
          dateTime: task.fromDate,
          timeZone: "India Standard Time",
        },
        reminderDateTime: {
          dateTime: task.toDate,
          timeZone: "India Standard Time",
        },
        importance: task.priority.toLocaleLowerCase(),
        isReminderOn: !Util.isNullOrUndefinedOrEmpty(task.reminder),
      };

      try {
        const response = await (selectedItem.taskId>0
          ? updateTask(accessToken, userId, taskListId, taskObj)
          : createTask(accessToken, userId, taskListId, taskObj));
        if (response) {
          setTaskItemObj({ ...taskItemObj, id: response });
        }
        return { taskId: response, taskListId: taskListId, "userId":userId };
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
  useEffect(() => {
    if (!dealId) return; // Exit early if dealId is not available

    const fetchDealDetails = async () => {
        try {
            setIsLoading(true);
            const res = await dealSvc.getDealsById(dealId);

            console.log("API Response:", res);

            const dealData = res || {};
            if (dealData) {
                // Update treatmentName if available
                if (treatmentName !== dealData.treatmentName) {
                    setTreatmentName(dealData.treatmentName || "");
                    setValue("treatmentName", dealData.treatmentName || "", { shouldValidate: true });
                }
                // Update personName if available
                if (personName !== dealData.personName) {
                    setPersonName(dealData.personName || "");
                    setValue("personName", dealData.personName || "", { shouldValidate: true });
                }
            }
        } catch (error) {
            console.error("Error fetching deal details:", error);
        } finally {
            setIsLoading(false); // Ensure loading state is cleared
        }
    };

    fetchDealDetails(); // Call the async function
}, [dealId, setValue, treatmentName, personName]);



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
        dateTime: task.fromDate,
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
        ? updateCalendarEventToUser(
            accessToken,
            userId,
            taskObj,
            taskItemObj.id
          )
        : addCalendarEventToUser(accessToken, userId, taskObj));
      if (response) {
        setTaskItemObj({ ...taskItemObj, id: response });
      }
      return { taskId: response, taskListId: null, "userId":userId };
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
    addUpdateItem.taskId = selectedItem?.taskId ?? (0 as any);
   // addUpdateItem.dueDate = new Date(addUpdateItem.dueDate);
    addUpdateItem.dueDate = addUpdateItem.fromDate
        ? new Date(addUpdateItem.fromDate).toISOString() // Convert to ISO 8601 string format
        : "";
    //addUpdateItem.reminder = new Date(addUpdateItem.reminder);
    addUpdateItem.reminder = addUpdateItem.toDate
        ? new Date(addUpdateItem.toDate).toISOString() // Convert to ISO 8601 string format
        : "";
    console.log("addUpdateItem" + { ...addUpdateItem });

    //if (new Date(addUpdateItem.reminder) < new Date()) {
    //  toast.warning("Reminder cannot be lesser than current date");
    //  return;
   // }
    //if (new Date(addUpdateItem.reminder) > new Date(addUpdateItem.dueDate)) {
      //toast.warning("Reminder cannot be greater than due date");
     // return;
   // }

    initiateactioninAzure(addUpdateItem).then((res) => {
      
      if (res) {
        addUpdateItem.taskGUID = res.taskId;
        addUpdateItem.taskListGUID = res.taskListId as any ?? "123";
        addUpdateItem.userGUID = res.userId as any;
        addUpdateItem.assignedTo = 1;//TODO
        addUpdateItem.startDate = item.startDateTime;
        console.log("taskItem obj before submission... "+ JSON.stringify(addUpdateItem));
        taskSvc
          .addorUpdateTask(addUpdateItem)
          .then((res) => {
            console.log("response received post addorUpdateTask "+ JSON.stringify(res));
            setDialogIsOpen(false);
            if(props.onSaveTask) props.onSaveTask();
            if (res) {
              toast.success(
                `Task ${
                  addUpdateItem.taskId > 0 ? "updated" : "added"
                } successfully`
              );
              let auditLogObj = {
                ...new PostAuditLog(),
                eventType: "Task created",
                dealId: dealId,
              };
              auditLogObj.createdBy = Util.UserProfile()?.userId;
              auditLogObj.eventDescription =
                addUpdateItem.taskId > 0
                  ? "Task was updated for the deal"
                  : "A new task was crated for the deal";
              auditLogsvc.postAuditLog(auditLogObj);
            } else {
              if(addUpdateItem.todo==="To Do"){
                handleTaskFailure(accessToken, userGuID, res)
              }
            }
          })
          .catch((err) => {
            console.log("error is "+err);
            if(addUpdateItem.todo==="To Do"){
              handleTaskFailure(accessToken, userGuID, res)
            }
          });
      }
    });
    return;
  };

  function handleTaskFailure(
    accessToken: any, 
    userGuID: any, 
    res: any
  ) {
    toast.error("Unable to add Task");
    console.log("Failed to add task in database, so deleting it from Azure");
    deleteTask(
      accessToken,
      userGuID,
      res?.taskListId, 
      res?.taskId
    );
  }

  const getDropdownvalues = (item: any) => {
    if (item.key === "Type") {
      return typesList.map((i: any) => ({ name: i, value: i })) ?? [];
    }
    if (item.key === "Priority") {
      return prioritiesList.map((i: any) => ({ name: i, value: i })) ?? [];
    }
    if (item.key === "Name") {
      return activityList; // Return the activity list for the "Name" dropdown
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
   // if (item.key === "Type") {
   //   setActivityType(value); // Update activity type dynamically
    //  setValue("name", value); // Update the text field with selected value
  //  }
  if (item.key === "Name") {
    setActivityType(value); // Update the activity type dynamically
    setValue("name", value); // Update the form field value
    // Update the calendar event title
    setCalendarEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === "temp-event") {
          return { ...event, title: value }; // Update the title dynamically
        }
        return event;
      });
    });
    }
    if (item.key === "From Date") {
      setSelectedItem({ ...selectedItem, fromDate: value });
  
      // Dynamically update calendar slot based on "From Date" and "To Date"
      setCalendarEvents((prevEvents) => {
        const toDate = selectedItem.toDate || value; // Use existing "toDate" or "fromDate" if not set
        return [
          ...prevEvents.filter((e) => e.id !== "temp-event"), // Remove existing temp event
          {
            id: "temp-event", // Temporary ID for the currently selected event
            title: activityType,
            start: value,
            end: toDate,
          },
        ];
      });
    }
    if (item.key === "To Date") {
      setSelectedItem({ ...selectedItem, toDate: value });
  
      // Dynamically update calendar slot based on "From Date" and "To Date"
      setCalendarEvents((prevEvents) => {
        const fromDate = selectedItem.fromDate || value; // Use existing "fromDate" or "toDate" if not set
        return [
          ...prevEvents.filter((e) => e.id !== "temp-event"), // Remove existing temp event
          {
            id: "temp-event", // Temporary ID for the currently selected event
            title: activityType,
            start: fromDate,
            end: value,
          },
        ];
      });
    }
    if (item.key === "Task Details") {
      setSelectedItem({ ...selectedItem, taskDetails: value });
    }
    setValue(item.value as never, value as never);
    if (value) unregister(item.value as never);
    else register(item.value as never);
    resetField(item.value as never);

  };
  // Remove the colon (:) from rendering
  const cleanControlsList = controlsList.map((control) =>
    control.key === "" ? { ...control, key: null } : control
  );
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
              <br />
              <div className="row">
  <div className="col-md-5">
    <div className="modelformfiledrow row" style={{ gap: "16px" }}> {/* Add spacing */}
      <div>
        <div className="modelformbox ps-2 pe-2">
          <div style={{ width: "100%" }}>
            <GenerateElements
              controlsList={cleanControlsList}
              selectedItem={selectedItem}
              onChange={(value: any, item: any) => onChange(value, item)}
              getListofItemsForDropdown={(e: any) => getDropdownvalues(e) as any}
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Divider */}
  <div className="col-md-1 text-center align-items-center d-flex">
    <div
      style={{
        borderLeft: "1px solid #ccc",
        height: "100%",
        width: "1px",
        margin: "0 auto",
      }}
    ></div>
  </div>

  {/* Right Section - Calendar */}
  <div className="col-md-6">
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        selectable
        defaultView="day" // Set the default view to "day"
        onSelectSlot={(slot) => {
          setSelectedItem({
            ...selectedItem,
            fromDate: slot.start,
            toDate: slot.end,
          });
          setValue("fromDate", slot.start);
          setValue("toDate", slot.end);
          // Update calendar events to visually show the selected slot
          setCalendarEvents((prevEvents) => [
            ...prevEvents.filter((event) => event.id !== "temp-event"), // Remove existing temp event
            {
              id: "temp-event", // Temporary ID for selected event
              title: activityType, // Use the updated activity type
              start: slot.start,
              end: slot.end,
            },
          ]);
        }}
      />
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

