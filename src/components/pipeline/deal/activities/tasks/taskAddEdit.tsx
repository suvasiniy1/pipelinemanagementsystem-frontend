import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
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


type params = {
  dealId: number;
  dialogIsOpen: any;
  setDialogIsOpen: any;
  onSaveTask?: any;
  taskItem?:Tasks;
  onCloseDialog?: any;
};

export const TaskAddEdit = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen, dealId, taskItem, ...Others } = props;
  const [selectedItem, setSelectedItem] = useState(taskItem ?? new Tasks());
  const [isLoading, setIsLoading] = useState(false);
  const typesList=["To Do", "Call", "Email"];
  const prioritiesList = ["High", "Medium", "Low"]
  const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
  const taskSvc = new TaskService(ErrorBoundary);

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
    },
    {
      key: "Reminder",
      value: "reminder",
      type: ElementType.datepicker,
      isRequired: true,
      isSideByItem: true,
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
        elementSize:12,
        hideLabel:true
      }
  ];

  useEffect(()=>{
    if(taskItem){
      setValue("dueDate" as never, taskItem.dueDate as never);
      setValue("reminder" as never, taskItem.reminder as never);
    }
  }, [taskItem])

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
  const { handleSubmit, unregister, register, resetField, setValue, setError } = methods;

  const onSubmit = (item:any) => {
    
    let addUpdateItem: Tasks = new Tasks();
    addUpdateItem.createdBy = Util.UserProfile()?.userId;
    addUpdateItem.modifiedBy = Util.UserProfile()?.userId;
    addUpdateItem.createdDate = new Date();
    Util.toClassObject(addUpdateItem, item);
    addUpdateItem.dealId = dealId;
    addUpdateItem.taskId = taskItem?.taskId ?? 0 as any;
    addUpdateItem.dueDate = new Date(addUpdateItem.dueDate);
    addUpdateItem.reminder = new Date(addUpdateItem.reminder);
    console.log("addUpdateItem" + { ...addUpdateItem });

    if(new Date(addUpdateItem.reminder)<new Date()){
        toast.warning("Reminder cannot be lesser than current date");
        return;
    }
    if(new Date(addUpdateItem.reminder)>new Date(addUpdateItem.dueDate)){
        toast.warning("Reminder cannot be greater than due date");
        return;
    }

    (addUpdateItem.taskId > 0 ? taskSvc.putItemBySubURL(addUpdateItem, `${addUpdateItem.taskId}`) : taskSvc.postItemBySubURL(addUpdateItem, "AddTask")).then(res => {
      setDialogIsOpen(false);
      props.onSaveTask();  
      if (res) {
            toast.success("Task added successfully");
        }
        else {
            toast.error("Unable to add Task");
        }
    })
  };

  const getDropdownvalues = (item: any) => {
    if (item.key === "Type") {
        return typesList.map(( i:any ) => ({ "name": i, "value": i })) ?? [];;
    }
    if (item.key === "Priority") {
        return prioritiesList.map(( i:any ) => ({ "name": i, "value": i })) ?? [];;
    }
    if (item.key === "Assigned To") {
        return utility?.persons?.map(({ personName, personID }) => ({ "name": personName, "value": personID })) ?? [];
    }
  };

  const onChange = (value: any, item: any) => {

    setValue(item.value as never, value as never)
    if(value) unregister(item.value as never);
    else register(item.value as never);
    resetField(item.value as never);

    if (item.key === "Due Date") {
        setSelectedItem({ ...selectedItem, "dueDate": value });
    }
    if (item.key === "Reminder") {
        setSelectedItem({ ...selectedItem, "reminder": value });
    }
    if (item.key === "Task Details") {
        setSelectedItem({ ...selectedItem, "taskDetails": value });
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
