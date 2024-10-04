import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@material-ui/core";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ViewEditProps } from "../../../common/table";
import { EmailConfiguration } from "../../../models/emailConfiguration";
import { ElementType, IControl } from "../../../models/iControl";
import { Utility } from "../../../models/utility";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import Util, { IsMockService } from "../../../others/util";
import { EmailConfigurationService } from "../../../services/emailConfigurationService";
import { TemplateGrid } from "./templateGrid";
import { ContacteService } from "../../../services/contactService";
import { Contact } from "../../../models/contact";
const steps = ["Template", "Settings"];

const EmailConfigurationAddEditDialog: React.FC<ViewEditProps> = (props) => {
  const {
    header,
    onSave,
    closeDialog,
    selectedItem,
    setSelectedItem,
    dialogIsOpen,
    setDialogIsOpen,
    isReadOnly,
    setIsReadOnly,
    setLoadRowData,
    ...others
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const emailConfigSvc = new EmailConfigurationService(ErrorBoundary);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<any>());
  const [selectedId, setSelectedId] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [scheduleOptionType, setScheduleOptionType] = useState("Send Now");
  const contactSvc = new ContacteService(ErrorBoundary);
  const [contactsList, setContactsList] = useState<Array<Contact>>([]);
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );
  const statusList = ["Draft", "Scheduled", "Sent", "Archived"];
  const controlsList1: Array<IControl> = [
    {
      key: "From Name",
      value: "fromName",
      isRequired: true,
      sidebyItem: "From Address",
      type: ElementType.dropdown,
    },
    {
      key: "From Address",
      value: "fromAddress",
      isRequired: true,
      isSideByItem: true,
      regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errMsg1: "Please enter a valid email address",
      type: ElementType.dropdown,
    },
    {
      key: "Subject",
      value: "subject",
      isRequired: true,
      sidebyItem: "Status",
    },
    {
      key: "Status",
      value: "status",
      isRequired: true,
      isSideByItem: true,
      type: ElementType.dropdown,
    },
    {
      key: "Reply to Address",
      value: "replytoaddress",
      isRequired: true,
      sidebyItem: "Campaign",
      regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errMsg1: "Please enter a valid email address",
    },
    {
      key: "Campaign",
      value: "campaginId",
      isSideByItem: true,
    },
    {
      key: "To Address",
      value: "toAddress",
      isRequired: true,
      type: ElementType.multiSelectDropdown,
      isControlInNewLine: true,
      sidebyItem: "Schedule Option",
      isSidebyItemHavingCustomLabels: true,
    },
    {
      key: "Schedule Option",
      value: "scheduleOption",
      label1: "Send Now",
      label2: "Schedule",
      isSwitchableElement: true,
      element1Type: null as any,
      element2Type: ElementType.datepicker,
      isControlInNewLine: true,
      isSideByItem: true,
      isRequired: true,
    },
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const [formOptions, setFormOptions] = useState({
    resolver: yupResolver(getValidationsSchema(controlsList1)),
  } as any);
  // = { resolver: yupResolver(step1Schema) };
  // const { control, reset, formState, watch, setValue } = useForm();
  const [methods, setMethods] = useState(useForm(formOptions));
  const {
    register,
    resetField,
    unregister,
    handleSubmit,
    trigger,
    clearErrors,
    control,
    reset,
    formState,
    watch,
    setValue,
    getValues,
  } = methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    contactSvc.getContacts().then((res) => {
      setContactsList(res);
      setIsLoading(false);
    }).catch(err=>{

    });
  }, []);

  useEffect(() => {
    if (selectedItem && selectedItem.id > 0) {
      let obj = {
        ...selectedItem,
        optionType: selectedItem.sendNow ? "Send Now" : "Schedule",
        scheduleOption: selectedItem.sendNow
          ? (null as any)
          : selectedItem.scheduleTime,
      };
      setSelectedItem(obj);
      setSelectedId(obj.emailtemplateId);
      setTimeout(() => {
        controlsList1.forEach((c) => {
          resetValidationsOnLoad(c.value, obj[c.value]);
        });
        setValue("scheduleOption" as never, selectedItem.scheduleTime as never);
        setIsLoading(false);
      }, 100);
    } else setIsLoading(false);
  }, []);

  useEffect(() => {
    let schema =
      scheduleOptionType === "Send Now"
        ? getValidationsSchema(
            controlsList1.filter((c) => c.key != "Schedule Option")
          )
        : getValidationsSchema(controlsList1);
    setFormOptions({ resolver: yupResolver(schema) } as any);
  }, [scheduleOptionType]);

  const resetValidationsOnLoad = (key: any, value: any) => {
    setValue(key as never, value as never);
  };

  const onChange = (
    value: any,
    item: any,
    itemName?: any,
    isValidationOptional: boolean = false
  ) => {
    if (!isValidationOptional) {
      setValue(item.value as never, value as never);
      if (value) unregister(item.value as never);
      else register(item.value as never);
      resetField(item.value as never);
    }

    if (item.key === "To Address") {
      setSelectedItem({ ...selectedItem, toaddress: value });
    }
    if (item.key === "Schedule Option") {
      setSelectedItem({ ...selectedItem, scheduleOption: value });
    }
  };

  const onSwitchableOptionChange = (e: any) => {
    setScheduleOptionType(e);
    setSelectedItem({ ...selectedItem, optionType: e });
    setSelectedItem({ ...selectedItem, scheduleOption: null as any });
  };

  const getDropdownvalues = (item: any) => {
    if (item.key === "To Address") {
      return (
        contactsList.map(({ email }) => ({ name: email, value: email })) ?? []
      );
    }

    if (item.key === "From Address") {
      return (
        utility?.persons.map(({ email }) => ({ name: email, value: email })) ??
        []
      );
    }

    if (item.key === "From Name") {
      return (
        utility?.persons.map(({ personName }) => ({
          name: personName,
          value: personName,
        })) ?? []
      );
    }

    if (item.key === "Status") {
      return statusList.map((item) => ({ name: item, value: item }));
    }
  };

  const onSubmit = (item: any) => {
    let obj: EmailConfiguration = { ...selectedItem };
    Util.toClassObject(obj, item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.id = obj.id ?? 0;
    obj.scheduleTime =
      scheduleOptionType === "Send Now"
        ? new Date()
        : new Date(obj.scheduleOption);
    obj.sendNow = scheduleOptionType === "Send Now";
    obj.campaginId = obj.campaginId ?? 0;
    obj.emailtemplateId = selectedId as any;
    console.log("ItemToSave");
    console.log(obj);

    (obj.id > 0
      ? emailConfigSvc.putItemBySubURL(obj, `${obj.id}`)
      : emailConfigSvc.postItemBySubURL(obj, "Add")
    )
      .then((res) => {
        toast.success(
          `Template ${obj.id > 0 ? "updated" : "created"}  successfully`
        );
        setDialogIsOpen(false);
      })
      .catch((err) => {
        toast.error(`Unable to ${obj.id > 0 ? "update" : "save"} template`);
      });
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (item?: any) => {
    if (!selectedId) {
      toast.warn("Please select template to proceed further");
      return;
    }
    if (activeStep == steps.length - 1) {
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const customFooter = () => {
    return (
      <>
        <div className="modalfootbar">
          <button
            onClick={closeDialog}
            className="btn btn-secondary btn-sm me-2"
            id="closeDialog"
          >
            Cancel
          </button>
          <button
            onClick={handleBack}
            className="btn btn-secondary btn-sm me-2"
            id="closeDialog"
            hidden={activeStep == 0}
          >
            Back
          </button>
          <button
            onClick={(e: any) => handleNext()}
            className="btn btn-primary btn-sm me-2"
            id="closeDialog"
            hidden={activeStep == steps.length - 1}
          >
            Next
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary btn-sm me-2"
            id="closeDialog"
            hidden={activeStep != steps.length - 1}
          >
            Save
          </button>
        </div>
      </>
    );
  };

  const getSelectedList = (item: IControl) => {
    let list: Array<any> = [];
    if (item.key === "To Address") {
      var res = (selectedItem as EmailConfiguration).toAddress?.split(",");
      let personsList = utility?.persons.map(({ email }) => ({
        name: email,
        value: email,
      }));
      res?.forEach((r) => {
        list.push(personsList.find((p) => p.name === r));
      });
    }
    return list;
  };
// Handle template selection
const handleTemplateSelect = (template: any) => {
  setSelectedTemplate(template);
  setSelectedId(template.id); // Update the selectedId with the template's id
};
  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            dialogSize={"xl"}
            isFullscreen={true}
            header={"Add Task"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
            customFooter={customFooter()}
          >
            <>
              {isLoading ? (
                <div className="alignCenter">
                  <Spinner />
                </div>
              ) : (
                <>
                  <Box sx={{ width: "100%" }}>
                    <Stepper activeStep={activeStep}>
                      {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                          optional?: React.ReactNode;
                        } = {};
                        if (isStepSkipped(index)) {
                          stepProps.completed = false;
                        }
                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Box>
                  <br />
                  {activeStep == 0 ? (
                    <TemplateGrid
                    setSelectedId={setSelectedId}
                    selectedId={selectedId as any}
                    onTemplateSelect={handleTemplateSelect} // Pass the handler
                  />
                  ) : (
                    <GenerateElements
                      controlsList={controlsList1}
                      selectedItem={selectedItem}
                      onChange={(value: any, item: any) =>
                        onChange(value, item)
                      }
                      defaultSwitch={selectedItem.optionType}
                      onSwitchableOptionChange={(e: any) =>
                        onSwitchableOptionChange(e)
                      }
                      getListofItemsForDropdown={(e: any) =>
                        getDropdownvalues(e) as any
                      }
                      getSelectedList={(e: any) => getSelectedList(e)}
                    />
                  )}
                </>
              )}
            </>
            <br />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default EmailConfigurationAddEditDialog;
