import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { AddEditDialog } from "../../../../common/addEditDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import Util from "../../../../others/util";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Rule, ConditionCSV, DealFilter } from "../../../../models/dealFilters";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { DealFiltersService } from "../../../../services/dealFiltersService";
import { ErrorBoundary } from "react-error-boundary";
import { DatePickerWithValidation } from "../../../../elements/datePicker";
import Picker from "react-datepicker";
import LocalStorageUtil from "../../../../others/LocalStorageUtil";
import Constants from "../../../../others/constants";
import { DotdigitalCampagin } from "../../../../models/dotdigitalCampagin";
import { JustcallCampagin } from "../../../../models/justcallCampagin";
import { JustcallCampaignService } from "../../../../services/justCallCampaignService";

const operatorOptions = [
  { label: "is empty", value: "IS NULL" },
  { label: "is not empty", value: "IS NOT NULL" },
  { label: "is", value: "=" },
  { label: "is not", value: "!=" },
  { label: "is later than", value: ">" },
  { label: "is earlier than", value: "<" },
  { label: "is exactly or later than", value: ">=" },
  { label: "is exactly or earlier than", value: "<=" },
];

const dealStatusList = [
  { value: "1", label: "Open" },
  { value: "2", label: "Won" },
  { value: "3", label: "Lost" }, 
  { value: "4", label: "Closed" },
  { value: "5", label: "Deleted" },
];

const fieldOptions = [
  { value: "1", label: "Title" },
  { value: "2", label: "Creator" },
  { value: "ContactPersonID", label: "Owner" },
  { value: "4", label: "Value" },
  { value: "6", label: "Probability" },
  { value: "7", label: "Organization" },
  { value: "8", label: "Pipeline" },
  { value: "9", label: "Contact person" },
  { value: "stageid", label: "Stage" },
  { value: "11", label: "Label" },
  { value: "statusid", label: "Status" },
  { value: "13", label: "Deal created" },
  { value: "14", label: "Update time" },
  { value: "15", label: "Last stage change" },
  { value: "16", label: "Next activity date" },
  { value: "17", label: "Last activity date" },
  { value: "18", label: "Won time" },
  { value: "19", label: "Last email received" },
  { value: "20", label: "Last email sent" },
  { value: "21", label: "Lost time" },
  { value: "22", label: "Deal closed on" },
  { value: "23", label: "Lost reason" },
  { value: "24", label: "Visible to" },
  // { value: "26", label: "Total activities" },
  // { value: "27", label: "Done activities" },
  // { value: "28", label: "Activities to do" },
  // { value: "29", label: "Email messages count" },
  // { value: "30", label: "Expected close date" },
  // { value: "34", label: "Source origin" },
  // { value: "35", label: "Source origin ID" },
  // { value: "36", label: "Source channel" },
  // { value: "37", label: "Source channel ID" },
  // { value: "38", label: "MRR" },
  // { value: "39", label: "ARR" },
  // { value: "40", label: "ACV" },
  // { value: "41", label: "Currency" },
  // { value: "42", label: "Date of entering stage" },
  // { value: "43", label: "Attached product" },
];

const filterTypeOptions = [
  { value: "deal", label: "Deal" },
  { value: "organization", label: "Organization" },
  { value: "person", label: "Person" },
  { value: "product", label: "Product" },
  { value: "activity", label: "Activity" },
];

const filterTypes=[
  { value: "justCall", label: "JustCall" },
  { value: "dotDigital", label: "DotDigital" },
  { value: "others", label: "Others" }
]

// Condition schema
const conditionSchema = Yup.object().shape({
  object: Yup.string().required("Field is required"),
  field: Yup.string().required("Attribute is required"),
  operator: Yup.string().required("Operator is required"),
  value: Yup.string().required("Value is required"),
});

// Main form schema
const formSchema1 = Yup.object().shape({
  name: Yup.string().required("Filter name is required"),
  visibility: Yup.string().required("Visibility is required"),
  filterType: Yup.string().nullable(),
  filterAction: Yup.string().nullable(),

  // Validate 'ALL' conditions
  allConditions: Yup.array()
    .of(conditionSchema)
    .min(1, "At least one condition is required in ALL conditions"),

  // // Validate 'ANY' conditions
  // anyConditions: Yup.array()
  //   .of(conditionSchema)
});

const formSchema2 = Yup.object().shape({
  name: Yup.string().required("Filter name is required"),
  visibility: Yup.string().required("Visibility is required"),
  filterType: Yup.string().nullable(),
  filterAction: Yup.string().nullable(),

  // Validate 'ALL' conditions
  allConditions: Yup.array()
    .of(conditionSchema)
    .min(1, "At least one condition is required in ALL conditions"),

  // Validate 'ANY' conditions
  anyConditions: Yup.array()
    .of(conditionSchema)
    .min(1, "At least one condition is required in ALL conditions"),
});

// Define types for conditions and props
interface Condition {
  object: string;
  field: string;
  operator: string;
  value: any;
}

interface FilterConditionProps {
  condition: Condition;
  onChange: (key: keyof Condition, value: string | number) => void;
  onDelete: () => void;
  index: number; // pass the index to access specific errors
  conditionType: any; // either "allConditions" or "anyConditions" to handle different arrays
  conditionsLength: number;
}

// FilterCondition Component
const FilterCondition: React.FC<FilterConditionProps> = ({
  condition,
  onChange,
  onDelete,
  index, // pass the index to access specific errors
  conditionType, // either "allConditions" or "anyConditions" to handle different arrays
  conditionsLength,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();
  // Access specific errors for each condition
  const errorPath = `${conditionType}[${index as any}]`;
  const fieldError = (errors[conditionType] as any)?.[index]?.object;
  const attributeError = (errors[conditionType] as any)?.[index]?.field;
  const operatorError = (errors[conditionType] as any)?.[index]?.operator;
  const valueError = (errors[conditionType] as any)?.[index]?.value;
  interface Pipeline {
    pipelineID: string; 
    pipelineName: string;
  }
  
  useEffect(() => {
    setValue(`${conditionType}.${index}.object`, condition.object);
    setValue(`${conditionType}.${index}.field`, condition.field);
    setValue(`${conditionType}.${index}.operator`, condition.operator);
    setValue(`${conditionType}.${index}.value`, condition.value);
  }, [condition, setValue, index, conditionType]);

  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {
    setPipelines(getPipelines());
  }, []);
  
  const getPipelines = (): Pipeline[] => {
    const res = JSON.parse(localStorage.getItem("getAllPipeLinesAndStages") || "[]");
    return res.map((pipeline: any) => ({
      pipelineID: pipeline.pipelineStages?.[0]?.pipelineID || "", 
      pipelineName: pipeline.pipelineName || "Unknown Pipeline",
    }));
  };
  
  const getAllPipeLinesAndStages = (): Array<{
    pipeLine: string;
    pipelineID: string | null;
    stages: Array<{ stageID: string; stageName: string }>;
  }> => {
    let list: Array<any> = [];
    const res = JSON.parse(localStorage.getItem("getAllPipeLinesAndStages") || "[]");
    console.log("Raw pipelines with stages:", res); // Log raw data for debugging
  
    res.forEach((pipeline: any) => {
      const obj = {
        pipeLine: pipeline.pipelineName || "Unknown Pipeline",
        pipelineID: pipeline.pipelineStages?.[0]?.pipelineID || null, // Extract pipelineID from the first stage
        stages: (pipeline.pipelineStages || []).map((stage: { stageID: string; stageName: string }) => ({
          stageID: stage.stageID || "Unknown Stage ID",
          stageName: stage.stageName || "Unknown Stage Name",
        })),
      };
      list.push(obj);
    });
  
    return list;
  };
 

  const valueJSX = (key: string) => {
    console.log("key is.... " + key);
    switch (key) {
      case "8": // Pipeline
      return (
        <select
          className="form-control"
          disabled={!getValues(`${conditionType}.${index}.field`)}
          value={getValues(`${conditionType}.${index}.value`) || ""}
          {...register(`${conditionType}.${index}.value`)}
          onChange={(e) =>
            setValue(`${conditionType}.${index}.value`, e.target.value)
          }
        >
          <option value="">Select</option>
          {pipelines.map((pipeline) => (
            <option key={pipeline.pipelineID} value={pipeline.pipelineID}>
              {pipeline.pipelineName}
            </option>
          ))}
        </select>
      );
      case "stageid":
        return (
          <select
            className="form-control"
            disabled={!getValues(`${conditionType}.${index}.field`)}
            defaultValue={`${conditionType}.${index}.value`}
            {...register(`${conditionType}.${index}.value`)}
          >
            <option value="">Select</option>
            {getAllPipeLinesAndStages().map((item, index) => (
              <>
                <option
                  key={index}
                  disabled
                  className="non-selectable-option"
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  {item.pipeLine}
                </option>
                {item.stages.map((stage: any) => (
                  <option className="pl-4" key={stage.stageID} value={stage.stageID}>
                    &nbsp; &nbsp; {stage.stageName}
                  </option>
                ))}
              </>
            ))}
          </select>
        );
      case "statusid":
        return (
          <select
            className="form-control"
            disabled={!getValues(`${conditionType}.${index}.field`)}
            defaultValue={`${conditionType}.${index}.value`}
            {...register(`${conditionType}.${index}.value`)}
          >
            <option value="">Select</option>
            {getDropdownListforValueJSX(key).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "13":
      case "14":
      case "15":
      case "16":
      case "17":
      case "18":
      case "19":
      case "20":
      case "21":
      case "22":
        return (
          <Picker
            placeholderText="MM/DD/YYYY hh:mm:ss a"
            showIcon
            dateFormat={"MM/d/yyyy h:mm aa"}
            disabled={!getValues(`${conditionType}.${index}.field`)}
            selected={getValues(`${conditionType}.${index}.value`)}
            className="form-control"
            {...register(`${conditionType}.${index}.value`)}
            onChange={(e: any) =>
              setValue(`${conditionType}.${index}.value`, e)
            }
          />
          // <select
          //   className="form-control"
          //   defaultValue={`${conditionType}.${index}.value`}
          //   {...register(`${conditionType}.${index}.value`)}
          // >
          //   <option value="">Select</option>
          //   {getDropdownListforValueJSX(key).map((option) => (
          //     <option key={option.value} value={option.value}>
          //       {option.label}
          //     </option>
          //   ))}
          // </select>
        );

      default:
        return (
          <input
            className="form-control"
            type="text"
            disabled={!getValues(`${conditionType}.${index}.field`)}
            defaultValue={conditionType[index].value ?? null}
            {...register(`${conditionType}.${index}.value`)}
            placeholder="Value"
          />
        );
    }
  };

  const getDropdownListforValueJSX = (key: string) => {
    switch (key) {
      case "statusid":
        return dealStatusList;
      default:
        return [];
    }
  };

  return (
    <div className="form-group row pb-2">
      <div className="col-3">
        <select
          className="form-control"
          defaultValue={`${conditionType}.${index}.object`}
          {...register(`${conditionType}.${index}.object`)}
          onChange={(e: any) => {
            setValue(`${conditionType}.${index}.field`, null);
            setValue(`${conditionType}.${index}.operator`, null);
            setValue(`${conditionType}.${index}.value`, null);
            setValue(`${conditionType}.${index}.object`, e.target.value);
          }}
        >
          <option value="">Select</option>
          {filterTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {<p className="error-text text-danger">{fieldError?.message}</p>}
      </div>
      <div className="col-3">
        <select
          className="form-control"
          defaultValue={`${conditionType}.${index}.field`}
          {...register(`${conditionType}.${index}.field`)}
          disabled={!getValues(`${conditionType}.${index}.object`)}
          onChange={(e: any) => {
            setValue(`${conditionType}.${index}.operator`, null);
            setValue(`${conditionType}.${index}.value`, null);
            setValue(`${conditionType}.${index}.field`, e.target.value);
          }}
        >
          <option value="">Select</option>
          {fieldOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {<p className="error-text text-danger">{attributeError?.message}</p>}
      </div>

      <div className="col-2">
        <select
          className="form-control"
          defaultValue={`${conditionType}.${index}.operator`}
          disabled={!getValues(`${conditionType}.${index}.field`)}
          {...register(`${conditionType}.${index}.operator`)}
        >
          <option value="">Select</option>
          {operatorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

          {/* Add more operators if needed */}
        </select>
        {<p className="error-text text-danger">{operatorError?.message}</p>}
      </div>

      <div className="col-2">
        {valueJSX(getValues(`${conditionType}.${index}.field`))}
        {<p className="error-text text-danger">{valueError?.message}</p>}
      </div>
      <div className="col-2" style={{ alignContent: "center" }}>
        {conditionType === "allConditions" ? "AND" : "OR"}
        <button
          hidden={conditionsLength == 1 && conditionType === "allConditions"}
          onClick={(e: any) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <RemoveCircleIcon />
        </button>
      </div>
    </div>
  );
};

type params = {
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
  onSaveChanges: any;
  index?: number;
  selectedPipeLineId?: number;
  selectedStageId?: any;
  selectedFilter: DealFilter;
  setSelectedFilter: any;
};

// Main FilterEditor Component
const DealFilterAddEditDialog = (props: params) => {
  // State for conditions in both ALL and ANY sections

  const {
    dialogIsOpen,
    setDialogIsOpen,
    onSaveChanges,
    index,
    selectedPipeLineId,
    selectedStageId,
    ...others
  } = props;

  const dealFiltersSvc = new DealFiltersService(ErrorBoundary);
  const [selectedFilter, setSelectedFilter] = useState(
    props.selectedFilter ?? new DealFilter()
  );
  const [isDotDigitalSelected, setIsDotDigitalSelected]=useState(false);
  const [isJustCallSelected, setisJustCallSelected]=useState(false);
  const dotDigitalCampaignList = JSON.parse(LocalStorageUtil.getItemObject(Constants.DOT_DIGITAL_CAMPAIGNSLIST) as any ?? []);
  const justCallCampaignList = JSON.parse(LocalStorageUtil.getItemObject(Constants.JUST_CALL_CAMPAIGNSLIST) as any ?? []);

  const [allConditions, setAllConditions] = useState<Condition[]>([
    { object: "", field: "", operator: "", value: null as any },
  ]);
  const [anyConditions, setAnyConditions] = useState<Condition[]>([]);

  const [formOptions, setFormOptions] = useState({
    resolver: yupResolver(anyConditions.length > 0 ? formSchema2 : formSchema1),
    defaultValues: {
      name: "",
      visibility: "",
      allConditions: [
        { object: "", field: "", operator: "", value: null as any },
      ],
      anyConditions: [],
    },
  });

  const methods = useForm(formOptions as any);

  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    let obj = {
      ...selectedFilter,
      visibility: Util.isNullOrUndefinedOrEmpty(selectedFilter.isPublic)
        ? null
        : selectedFilter.isPublic
        ? "Public"
        : "Private",
    };

    if (selectedFilter.id > 0) {
      obj.allConditions = obj.conditions.find((i) => i.glue === "AND")
        ?.conditionList as any;
      setAllConditions(obj.allConditions ?? []);
      obj.anyConditions = obj.conditions.find((i) => i.glue === "OR")
        ?.conditionList as any;
      setAnyConditions(obj.anyConditions ?? []);
    }

    if (dialogIsOpen) {
      reset(obj); // Set the form values to the binding object when the dialog opens
    }
  }, [dialogIsOpen, reset]);

  const [filterName, setFilterName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  // Handlers for conditions
  const handleAddCondition = (
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>
  ) => {
    setConditions((prev) => [
      ...prev,
      { object: "", field: "", operator: "", value: null as any },
    ]);
  };

  const handleConditionChange = (
    index: number,
    key: keyof Condition,
    value: string | number,
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>
  ) => {
    setConditions((prev) =>
      prev.map((cond, i) => (i === index ? { ...cond, [key]: value } : cond))
    );
  };

  const handleDeleteCondition = (
    index: number,
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>,
    isAllConditions: boolean
  ) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
    setSelectedFilter(new DealFilter());
  };

  useEffect(() => {
    setFormOptions({
      resolver: yupResolver(
        anyConditions.length > 0 ? formSchema2 : formSchema1
      ),
      defaultValues: {
        name: "",
        visibility: "",
        allConditions: [
          { object: "", field: "", operator: "", value: null as any },
        ],
        anyConditions: [],
      },
    });
  }, [allConditions.length, anyConditions.length]);

  const onSubmit = (obj: any) => {
    // let filtersList =
    //   JSON.parse(localStorage.getItem("dealFilters") as any) ?? [];
    // let dealFilter = { ...obj, isPublic: obj.visibility === "Public" };
    // filtersList.push(dealFilter);
    // localStorage.setItem("dealFilters", JSON.stringify(filtersList));
    let dealFilter = new DealFilter();
    dealFilter.id = selectedFilter.id;
    dealFilter.isPublic = obj.visibility === "Public";
    dealFilter.createdBy = Util.UserProfile()?.userId;
    dealFilter.modifiedBy = Util.UserProfile()?.userId;
    dealFilter.createdDate = new Date();
    dealFilter.conditions = [];
    dealFilter.name = obj.name;
    dealFilter.filterType = obj.filterType;
    dealFilter.filterAction = obj.filterAction ?? "N/A";

    if (allConditions.length > 0) {
      dealFilter.conditions.push(
        buildConditionsArray("AND", allConditions, obj.allConditions)
      );
    }
    if (anyConditions.length > 0) {
      dealFilter.conditions.push(
        buildConditionsArray("OR", anyConditions, obj.anyConditions)
      );
    }

    dealFiltersSvc.saveDealFilters(dealFilter).then((res) => {
      if (res) {
        toast.success(
          `Deal filter ${
            selectedFilter.id > 0 ? " updated " : " created "
          } successfully`
        );
        props.onSaveChanges();
      }
    });
  };

  const buildConditionsArray = (glue: string, list: Array<any>, objList: Array<any>) => {
    let condition = new Rule();
    condition.glue = glue;
    condition.conditionList = [];
  
    const pipelines = JSON.parse(localStorage.getItem("getAllPipeLinesAndStages") || "[]").map((pipeline: any) => ({
      pipelineID: pipeline.pipelineID || null,
      pipelineName: pipeline.pipelineName || "Unknown Pipeline",
    }));
  
    list.forEach((ac, index) => {
      let objItem = objList[index];
      let conditionCSV = new ConditionCSV();
  
      conditionCSV = { ...objItem };
      conditionCSV.extraValue = objItem.value; // Default extraValue
  
      if (objItem.field === "8") { // Check for Pipeline field
        console.log("Pipelines: ", pipelines);
        console.log("Pipeline value from objItem: ", objItem.value);
  
        const pipeline = pipelines.find(
          (p: any) => p.pipelineID === objItem.value || p.pipelineName === objItem.value
        );
  
        if (pipeline) {
          console.log("Matched Pipeline: ", pipeline);
          conditionCSV.value = pipeline.pipelineID; 
          conditionCSV.extraValue = pipeline.pipelineName; 
        } else {
          console.log("No matching pipeline found!");
          conditionCSV.value = objItem.value || "";
        }
      }
  
      console.log("Condition CSV before pushing:", conditionCSV);
      condition.conditionList.push(conditionCSV);
    });
  
    console.log("Final Condition Object:", condition);
    return condition;
  };

  
  const onFilterTypeChange=(type:any)=>{
    setValue("filterAction", null as any);
    setIsDotDigitalSelected(type==="dotDigital");
    setisJustCallSelected(type==="justCall");
   }

  const getDotDigitalProgramsList=()=>{
   return dotDigitalCampaignList.map((item: DotdigitalCampagin) => ({
      name: item.name,
      value: item.id,
    })) ?? []
  }
  const getJustCallCampaignList=()=>{
    
    return justCallCampaignList.map((item: JustcallCampagin) => ({
       name: item.name,
       value: item.id,
     })) ?? []
   }
 
  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header={"Add Dealfilter"}
        dialogSize={"xl"}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        onSave={handleSubmit(onSubmit)}
      >
        {
          <>
            <div className="filter-editor">
              {/* ALL conditions section */}
              <h6 className="pb-2">
                Show deals that match ALL of these conditions:
              </h6>
              <div
                className="condition-group"
                style={{
                  backgroundColor: "#f7f7f7",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                {allConditions.map((condition, index) => (
                  <FilterCondition
                    key={`all-${index}`}
                    condition={condition}
                    onChange={(key, value) =>
                      handleConditionChange(index, key, value, setAllConditions)
                    }
                    onDelete={() =>
                      handleDeleteCondition(index, setAllConditions, true)
                    }
                    index={index}
                    conditionType={"allConditions"}
                    conditionsLength={allConditions.length}
                  />
                ))}
                <button
                  onClick={(event: any) => {
                    event.preventDefault();
                    handleAddCondition(setAllConditions);
                  }}
                >
                  + Add condition
                </button>
              </div>

              <div
                className="pt-2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <button
                  hidden={anyConditions.length > 0}
                  onClick={(event: any) => {
                    event.preventDefault();
                    handleAddCondition(setAnyConditions);
                  }}
                >
                  + Add Any conditions
                </button>
              </div>

              <div
                hidden={anyConditions.length == 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  position: "relative",
                  margin: "20px 0",
                }}
              >
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #333", // Make the line thicker and darker
                    width: "100%", // Ensure it spans the full width
                    margin: "0 10px", // Adds some space around the line
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "0 10px",
                    fontWeight: "bold", // Make text bold to stand out more
                    fontSize: "16px", // Adjust font size if needed
                    color: "#333", // Set text color to match the line color
                  }}
                >
                  Any conditions
                </span>
              </div>

              {/* ANY conditions section */}
              <h6 className="pb-2">And match ANY of these conditions:</h6>
              <div
                className="condition-group"
                style={{
                  backgroundColor: "#f7f7f7",
                  padding: "20px",
                  borderRadius: "8px",
                }}
                hidden={anyConditions.length == 0}
              >
                {anyConditions.map((condition, index) => (
                  <FilterCondition
                    key={`any-${index}`}
                    condition={condition}
                    onChange={(key, value) =>
                      handleConditionChange(index, key, value, setAnyConditions)
                    }
                    onDelete={() =>
                      handleDeleteCondition(index, setAnyConditions, false)
                    }
                    index={index}
                    conditionType={"anyConditions"}
                    conditionsLength={anyConditions.length}
                  />
                ))}
                <button
                  onClick={(event: any) => {
                    event.preventDefault();
                    handleAddCondition(setAnyConditions);
                  }}
                >
                  + Add condition
                </button>
              </div>

              <br />
              {/* Filter details */}
              <div className="col-12 d-flex">
                <div className="col-5">
                  <label>Filter name:</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={filterName}
                    {...methods.register("name")}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Filter name"
                  />
                  {errors.name && (
                    <p className="error-text text-danger">
                      {errors.name.message as any}
                    </p>
                  )}
                </div>
                <div className="col-2"></div>
                <div className="col-5">
                  <label>Visibility:</label>
                  <select
                    className="form-control"
                    value={visibility}
                    {...methods.register("visibility")}
                    onChange={(e) =>
                      setVisibility(e.target.value as "Private" | "Public")
                    }
                  >
                    <option value="">Select</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                  {errors.visibility && (
                    <p className="error-text text-danger">
                      {errors.visibility.message as any}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex pt-4">
                <div className="col-5">
                  <label>Filter Type:</label>
                  <select
                    className="form-control"
                    defaultValue={getValues("filterType")}
                    {...methods.register("filterType")}
                    onChange={(e:any)=>onFilterTypeChange(e.target.value)}
                  >
                    <option value="">Select</option>
                    {
                      filterTypes.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-2"></div>
                <div className="col-5">
                  <label>Filter Action:</label>
                  <select
                    className="form-control"
                    defaultValue={getValues("filterAction")}
                    hidden={!isDotDigitalSelected}
                    {...methods.register("filterAction")}
                    onChange={(e:any)=>setValue("filterAction", e.target.value)}
                  >
                    <option value="">Select</option>
                    {
                      getDotDigitalProgramsList().map((item:any, index:any)=>(
                        <option key={index} value={item.value}>{item.name}</option>
                      ))
                    }
                  </select>
                  <select
                    className="form-control"
                    defaultValue={getValues("filterAction")}
                    hidden={!isJustCallSelected}
                    {...methods.register("filterAction")}
                    onChange={(e:any)=>setValue("filterAction", e.target.value)}
                  >
                    <option value="">Select</option>
                    {
                      getJustCallCampaignList().map((item:any, index:any)=>(
                        <option key={index} value={item.value}>{item.name}</option>
                      ))
                    }
                  </select>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={getValues("filterAction")}
                    hidden={isDotDigitalSelected || isJustCallSelected}
                    {...methods.register("filterAction")}
                    placeholder="Filter action"
                  />
                </div>
              </div>
            </div>
          </>
        }
      </AddEditDialog>
    </FormProvider>
  );
};

export default DealFilterAddEditDialog;
