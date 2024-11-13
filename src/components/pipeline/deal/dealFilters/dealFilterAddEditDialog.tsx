import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { AddEditDialog } from "../../../../common/addEditDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import Util from "../../../../others/util";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Rule, ConditionCSV, DealFilter } from "../../../../models/dealFilters";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { DealFiltersService } from "../../../../services/dealFiltersService";
import { ErrorBoundary } from "react-error-boundary";

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

const fieldOptions = [
  { value: "1", label: "Title" },
  { value: "2", label: "Creator" },
  { value: "3", label: "Owner" },
  { value: "4", label: "Value" },
  { value: "6", label: "Probability" },
  { value: "7", label: "Organization" },
  { value: "8", label: "Pipeline" },
  { value: "9", label: "Contact person" },
  { value: "10", label: "Stage" },
  { value: "11", label: "Label" },
  { value: "12", label: "Status" },
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
  { value: "26", label: "Total activities" },
  { value: "27", label: "Done activities" },
  { value: "28", label: "Activities to do" },
  { value: "29", label: "Email messages count" },
  { value: "30", label: "Expected close date" },
  { value: "34", label: "Source origin" },
  { value: "35", label: "Source origin ID" },
  { value: "36", label: "Source channel" },
  { value: "37", label: "Source channel ID" },
  { value: "38", label: "MRR" },
  { value: "39", label: "ARR" },
  { value: "40", label: "ACV" },
  { value: "41", label: "Currency" },
  { value: "42", label: "Date of entering stage" },
  { value: "43", label: "Attached product" },
];

const filterTypeOptions = [
  { value: "deal", label: "Deal" },
  { value: "organization", label: "Organization" },
  { value: "person", label: "Person" },
  { value: "product", label: "Product" },
  { value: "activity", label: "Activity" },
];

// Condition schema
const conditionSchema = Yup.object().shape({
  field: Yup.string().required("Field is required"),
  attribute: Yup.string().required("Attribute is required"),
  operator: Yup.string().required("Operator is required"),
  value: Yup.string().required("Value is required"),
});

// Main form schema
const formSchema = Yup.object().shape({
  name: Yup.string().required("Filter name is required"),
  visibility: Yup.string().required("Visibility is required"),

  // Validate 'ALL' conditions
  allConditions: Yup.array()
    .of(conditionSchema)
    .min(1, "At least one condition is required in ALL conditions"),

  // Validate 'ANY' conditions
  anyConditions: Yup.array()
    .of(conditionSchema)
    .min(1, "At least one condition is required in ANY conditions"),
});

// Define types for conditions and props
interface Condition {
  field: string;
  attribute: string;
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
  } = useFormContext();
  // Access specific errors for each condition
  const errorPath = `${conditionType}[${index as any}]`;
  const fieldError = (errors[conditionType] as any)?.[index]?.field;
  const attributeError = (errors[conditionType] as any)?.[index]?.attribute;
  const operatorError = (errors[conditionType] as any)?.[index]?.operator;
  const valueError = (errors[conditionType] as any)?.[index]?.value;

  return (
    <div className="condition-row">
      <div className="col-3">
        <select
          className="form-control"
          defaultValue={`${conditionType}.${index}.field`}
          {...register(`${conditionType}.${index}.field`)}
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
          defaultValue={`${conditionType}.${index}.attribute`}
          {...register(`${conditionType}.${index}.attribute`)}
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
        <input
          className="form-control"
          type="text"
          defaultValue={conditionType[index].value ?? null}
          {...register(`${conditionType}.${index}.value`)}
          placeholder="Value"
        />
        {<p className="error-text text-danger">{valueError?.message}</p>}
      </div>
      <div className="col-2">
        AND
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

  const [formOptions, setFormOptions] = useState({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      visibility: "",
      allConditions: [
        { field: "", attribute: "", operator: "", value: null as any },
      ],
      anyConditions: [],
    },
  });

  const methods = useForm(formOptions as any);

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    let obj = {
      ...selectedFilter,
      visibility: Util.isNullOrUndefinedOrEmpty(selectedFilter.isPublic)? null : selectedFilter.isPublic ? "Public" : "Private",
    };
    if (dialogIsOpen) {
      reset(obj); // Set the form values to the binding object when the dialog opens
    }
  }, [dialogIsOpen, reset]);

  const [allConditions, setAllConditions] = useState<Condition[]>([
    { field: "", attribute: "", operator: "", value: null as any },
  ]);
  const [anyConditions, setAnyConditions] = useState<Condition[]>([]);
  const [filterName, setFilterName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  // Handlers for conditions
  const handleAddCondition = (
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>
  ) => {
    setConditions((prev) => [
      ...prev,
      { field: "", attribute: "", operator: "", value: null as any },
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
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>
  ) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
    setSelectedFilter(new DealFilter());
  };

  useEffect(() => {
    setFormOptions({
      resolver: yupResolver(formSchema),
      defaultValues: {
        name: "",
        visibility: "",
        allConditions: [
          { field: "", attribute: "", operator: "", value: null as any },
        ],
        anyConditions: [],
      },
    });
  }, [allConditions.length, anyConditions.length]);

  const onSubmit = (obj: any) => {
    debugger;
    // let filtersList =
    //   JSON.parse(localStorage.getItem("dealFilters") as any) ?? [];
    // let dealFilter = { ...obj, isPublic: obj.visibility === "Public" };
    // filtersList.push(dealFilter);
    // localStorage.setItem("dealFilters", JSON.stringify(filtersList));
    let dealFilter = new DealFilter();
    dealFilter.isPublic = obj.visibility === "Public";
    dealFilter.createdBy = Util.UserProfile()?.userId;
    dealFilter.modifiedBy = Util.UserProfile()?.userId;
    dealFilter.createdDate = new Date();
    dealFilter.conditions = [];

    if(allConditions.length>0){
      dealFilter.conditions.push(buildConditionsArray("AND", obj.allConditions));
    }
    if(anyConditions.length>0){
      dealFilter.conditions.push(buildConditionsArray("OR", obj.anyConditions));
    }

    dealFiltersSvc.saveDealFilters(dealFilter).then(res=>{
      if(res){
        toast.success("Deal filter created successfully");
        props.onSaveChanges();
      }
    });
  };

  const buildConditionsArray = (glue: string, list: Array<any>) => {
    let condition = new Rule();
    condition.glue = glue;
    condition.conditionList = [];
    list.forEach((ac) => {
      let conditionCSV = new ConditionCSV();
      conditionCSV.object = ac.attribute;
      conditionCSV.value = ac.field;
      conditionCSV.operator = ac.operator;
      conditionCSV.extraValue = ac.value;
      condition.conditionList.push(conditionCSV);
    });
    return condition;
  };

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header={"Add Dealfilter"}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        onSave={handleSubmit(onSubmit)}
      >
        {
          <>
            <div className="filter-editor">
              {/* ALL conditions section */}
              <h6 className="pb-2">Show deals that match ALL of these conditions:</h6>
              <div className="condition-group" style={{ backgroundColor: '#f7f7f7', padding: '20px', borderRadius: '8px' }}>
                {allConditions.map((condition, index) => (
                  <FilterCondition
                    key={`all-${index}`}
                    condition={condition}
                    onChange={(key, value) =>
                      handleConditionChange(index, key, value, setAllConditions)
                    }
                    onDelete={() =>
                      handleDeleteCondition(index, setAllConditions)
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
                style={{ backgroundColor: '#f7f7f7', padding: '20px', borderRadius: '8px' }}
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
                      handleDeleteCondition(index, setAnyConditions)
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

              <br/>
              {/* Filter details */}
              <div className="col-12 filter-details d-flex">
                <div className="col-5">
                  <label>
                    Filter name:
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
                  </label>
                </div>
                <div className="col-2">

                </div>
                <div className="col-5">
                  <label>
                    Visibility:
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
                  </label>
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
