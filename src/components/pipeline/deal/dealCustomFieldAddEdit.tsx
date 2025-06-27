import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ElementType, ElementTypeMap, IControl } from "../../../models/iControl";
import Util from "../../../others/util";
import { toast } from "react-toastify";
import { PipeLine } from "../../../models/pipeline";
import { ErrorBoundary } from "react-error-boundary";
import { CustomFieldService } from "../../../services/customFieldService";
import { DealCustomFields } from "../../../models/deal";

interface Params {
  customFields: Array<IControl>;
  setCustomFields: (fields: IControl[]) => void;
  dialogIsOpen: boolean;
  setDialogIsOpen: (val: boolean) => void;
  selectedFieldIndex: number;
  onFieldsSubmit: (index: number) => void;
  refreshCustomFields: () => void;
}

const DealCustomFieldAddEdit = ({
  customFields,
  setCustomFields,
  dialogIsOpen,
  setDialogIsOpen,
  selectedFieldIndex,
  onFieldsSubmit,
  refreshCustomFields,
}: Params) => {
  const [selectedItem, setSelectedItem] = useState<any>({});
  const allPipeLinesList: Array<PipeLine> = JSON.parse(localStorage.getItem("allPipeLines") || "[]");

  const [selectedPipeLines, setSelectedPipeLines] = useState<PipeLine[]>([]);
  const [fieldType, setFieldType] = useState<string>("");
  const [optionInput, setOptionInput] = useState("");
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const customFieldsService = new CustomFieldService(ErrorBoundary);
  const hasSubmitted = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const controlsList: Array<IControl> = [
    { key: "Field Name", value: "fieldName", isRequired: true, isControlInNewLine: true },
    { key: "Field Type", value: "fieldType", isRequired: true, type: ElementType.dropdown, isControlInNewLine: true },
    { key: "PipeLine", value: "pipelineIds", isRequired: true, type: ElementType.multiSelectDropdown, isControlInNewLine: true, bindable: "value" },
  ];

  const schema = Yup.object().shape({
    fieldName: Yup.string().required("Field name is required"),
    fieldType: Yup.string().required("Field type is required"),
    pipelineIds: Yup.array().of(Yup.string().required()).min(1, "At least one pipeline is required"),
  });

  const methods = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, setValue } = methods;

  const onChange = (value: any, item: any) => {
    if (item.key === "Field Type") setFieldType(value);
    if (item.key === "PipeLine") {
      const arrayVal = Array.isArray(value) ? value : typeof value === "string" ? value.split(",").map(v => v.trim()) : [];
      setValue("pipelineIds" as never, arrayVal as never);
    }
  };

  const oncloseDialog = () => setDialogIsOpen(false);

  useEffect(() => {
  if (selectedFieldIndex >= 0) {
    const field = customFields[selectedFieldIndex];

    // 🛠 Parse pipelineIds safely
    const pipelineIds = Array.isArray(field.pipelineIds)
      ? field.pipelineIds.map(String)
      : typeof field.pipelineIds === "string"
        ? field.pipelineIds.split(",").map(p => p.trim()).filter(Boolean)
        : [];

    // 🛠 Correct fieldType mapping
    const elementTypeKey = Object.entries(ElementType)
      .find(([key, val]) => val === field.type)?.[0] ?? "";

    console.log("DEBUG selectedItem", {
      fieldName: field.key,
      fieldType: elementTypeKey,
      pipelineIds,
    });

    setSelectedItem({
      fieldName: field.key,
      fieldType: elementTypeKey,
      pipelineIds,
    });

    setValue("fieldName" as never, field.key as never);
    setValue("fieldType" as never, elementTypeKey as never);
    setValue("pipelineIds" as never, pipelineIds as never);
    setFieldType(elementTypeKey);

    // 🛠 Handle dropdown options
    const dropdownOptions = (field.options || []).map(opt =>
      typeof opt === "string" ? opt : opt.key ?? opt.value
    );
    setOptionsList(dropdownOptions);

    // 🛠 Populate selected pipelines
    const selectedList = pipelineIds
      .map(id => allPipeLinesList.find(p => p.pipelineID === +id))
      .filter(Boolean) as PipeLine[];

    setSelectedPipeLines(selectedList);
  } else {
    // Reset form
    setSelectedItem({});
    setValue("fieldName" as never, "" as never);
    setValue("fieldType" as never, "" as never);
    setValue("pipelineIds" as never, [] as never);
    setOptionsList([]);
    setOptionInput("");
    setFieldType("");
    setSelectedPipeLines([]);
  }
}, [selectedFieldIndex]);


  const onSubmit = async (item: any) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const pipelineIdsArray = item.pipelineIds ?? [];
      const pipelineIds = pipelineIdsArray.join(",");
      const updatedFields = [...customFields];

      const isDuplicate = updatedFields.some((i, index) => i.key === item.fieldName && selectedFieldIndex !== index);
      if (isDuplicate && selectedFieldIndex === -1) {
        toast.warn("Custom field with same Name already exists.");
        setIsSaving(false);
        return;
      }

      const newField: IControl = {
        key: item.fieldName,
        value: `value${selectedFieldIndex === -1 ? updatedFields.length + 1 : selectedFieldIndex + 1}`,
        isControlInNewLine: true,
        showDelete: true,
        showEdit: true,
        isRequired: true,
        elementSize: 9,
        pipelineIds,
       type: ElementType[fieldType as keyof typeof ElementType],
        options: ["dropdown", "singleOption"].includes(fieldType.toLowerCase()) ? optionsList.map(opt => ({ key: opt, value: opt })) : undefined,
      };

      if (selectedFieldIndex === -1) {
        updatedFields.push(newField);
      } else {
        updatedFields[selectedFieldIndex] = newField;
      }

      setCustomFields([...updatedFields]);
      await saveCustomField(newField);
      toast.success(`Custom field ${selectedFieldIndex >= 0 ? "updated" : "added"} successfully ✅`);
      refreshCustomFields();
      setDialogIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCustomField = async (item: IControl) => {
    const pipelineIdList = typeof item.pipelineIds === "string"
      ? item.pipelineIds.split(",").map(p => p.trim()).filter(p => p)
      : [];

    const fullPipelineIds = pipelineIdList.join(",");
    const isDropdown = ["singleoption", "dropdown"].includes((item.type || "").toLowerCase());

    const payload: DealCustomFields = {
      customFieldId: item.id ?? 0,
      dealID: 0,
      customField: item.key,
      customFieldType: item.type || "textbox",
      customFieldValue: "",
      customSelectValues: "",
      options: isDropdown && optionsList.length ? JSON.stringify(optionsList.map(opt => ({ key: opt, value: opt }))) : undefined,
      pipelineId: "0",
      pipelineIds: fullPipelineIds,
      createdBy: Util.UserProfile()?.userId,
      updatedDate: new Date(),
      userId: Util.UserProfile()?.userId,
      createdDate: new Date(),
      modifiedDate: new Date(),
      modifiedBy: Util.UserProfile()?.userId,
      updatedBy: Util.UserProfile()?.userId,
    };

    await customFieldsService.postItem(payload);
  };

  const getDropdownValues = (item: any) => {
    if (item.key === "Field Type") {
      const seen = new Set<string>();
      return Object.entries(ElementType)
        .filter(([_, label]) => {
          if (seen.has(label)) return false;
          seen.add(label);
          return true;
        })
        .map(([key, value]) => ({ name: value, value: key }));
    }
    if (item.key === "PipeLine") return allPipeLinesList.map(pl => ({ name: pl.pipelineName, value: pl.pipelineID }));
    return [];
  };

  const getSelectedList = () => selectedPipeLines.map(pl => ({ name: pl.pipelineName, value: pl.pipelineID }));

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header="Add Custom Field"
        dialogSize="lg"
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        onSave={handleSubmit(onSubmit)}
        customSaveChangesButtonName={selectedFieldIndex >= 0 ? "Update" : "Save"}
      >
        <GenerateElements
          controlsList={controlsList.slice(0, 2)}
          selectedItem={selectedItem}
          onChange={onChange}
          getListofItemsForDropdown={getDropdownValues}
          getSelectedList={getSelectedList}
        />

        {["dropdown", "singleOption"].includes(fieldType?.toLowerCase?.()) && (
          <div style={{ marginTop: "1rem" }}>
            <label><strong>Options (required)</strong></label>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: "1rem" }}>
              {optionsList.map((opt, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ width: "1rem" }}>☰</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...optionsList];
                      updated[idx] = e.target.value;
                      setOptionsList(updated);
                    }}
                    className="form-control"
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => setOptionsList(optionsList.filter((_, i) => i !== idx))}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <textarea
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                placeholder="Enter multiple options (Shift+Enter for newline)"
                className="form-control"
                rows={3}
                style={{ resize: "vertical", flexGrow: 1 }}
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  const newOptions = optionInput
                    .split("\n")
                    .map(opt => opt.trim())
                    .filter(opt => opt && !optionsList.includes(opt));
                  if (newOptions.length > 0) {
                    setOptionsList([...optionsList, ...newOptions]);
                    setOptionInput("");
                  }
                }}
              >
                ✓
              </button>
            </div>
          </div>
        )}

        <GenerateElements
          controlsList={controlsList.slice(2)}
          selectedItem={selectedItem}
          onChange={onChange}
          getListofItemsForDropdown={getDropdownValues}
          getSelectedList={getSelectedList}
        />
      </AddEditDialog>
    </FormProvider>
  );
};

export default DealCustomFieldAddEdit;
