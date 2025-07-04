import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import GenerateElements from "../../../common/generateElements";
import { Deal, DealCustomFields } from "../../../models/deal";
import Util from "../../../others/util";
import DealCustomFieldAddEdit from "./dealCustomFieldAddEdit";
import { toast } from "react-toastify";
import { CustomDealFieldsService } from "../../../services/customDealFieldsService";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "react-bootstrap";
import { DeleteDialog } from "../../../common/deleteDialog";
import { ElementType, IControl } from "../../../models/iControl";

interface Params {
  dealItem: Deal;
  setDealItem: (deal: Deal) => void;
  originalCustomFields?: DealCustomFields[]; // ✅ Add this
}

type FormValues = {
  [key: string]: string;
};

const DealDetailsCustomFields = ({ dealItem }: Params) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customFields, setCustomFields] = useState<IControl[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number>(-1);
  const [originalCustomFields, setOriginalCustomFields] = useState<DealCustomFields[]>([]);
  const [selectedItem, setSelectedItem] = useState<FormValues>({});

  const customFieldsService = new CustomDealFieldsService(ErrorBoundary);

  const methods = useForm<FormValues>({
    resolver: yupResolver(Yup.object().shape(Util.buildValidations(customFields))),
  });

  const { getValues, setValue, register } = methods;

  const getListofItemsForDropdown = (item: IControl) => {
    
  const match = customFields.find(f => f.key === item.key);
  return match?.options?.map(opt => ({ name: opt.key, value: opt.value })) ?? [];
};

  useEffect(() => {
    loadCustomFields();
  }, []);

const loadCustomFields = () => {
  setIsLoading(true);

  customFieldsService
    .getCustomFields(dealItem.dealID, dealItem.pipelineID)
    .then((res: any) => {
      const fields: IControl[] = [];
      const selectedObj: FormValues = {};
      const dealPipelineIdStr = dealItem.pipelineID.toString();
      
      const filteredFields = res.customFields.filter((cf: DealCustomFields) => {
        const ids = cf.pipelineIds?.split(",").map((p) => p.trim()) ?? [];

        if (ids.length === 0 && cf.pipelineId) {
          return String(cf.pipelineId) === dealPipelineIdStr;
        }

        if (ids.length === 0) return true;

        return ids.includes(dealPipelineIdStr);
      });

      filteredFields.forEach((cf: DealCustomFields, index: number) => {
        const valueKey = `value${index + 1}`;
        const isDropdown = ["singleoption", "dropdown"].includes(cf.customFieldType?.toLowerCase?.() ?? "");

        const field: IControl = {
          key: cf.customField,
          value: valueKey,
          isControlInNewLine: true,
          showDelete: true,
          showEdit: true,
          isRequired: true,
          elementSize: 9,
          type: isDropdown ? ElementType.dropdown : ElementType.textbox,
          pipelineIds: cf.pipelineIds
            ? cf.pipelineIds
            : cf.pipelineId
            ? String(cf.pipelineId)
            : "",
          options: [],
        };

        register(valueKey);

        if (isDropdown) {
          let parsedOptions: any[] = [];

          try {
            let rawOptions = cf.options;

            // Attempt to parse deeply nested JSON strings
            while (typeof rawOptions === "string") {
              rawOptions = JSON.parse(rawOptions);
            }

            if (Array.isArray(rawOptions)) {
              parsedOptions = rawOptions;
            }
          } catch (e) {
            console.warn(`⚠️ Failed to parse options for '${cf.customField}'`, e);
          }

          // Convert to { key, value } format
          const dropdownOptions = parsedOptions.map((opt: any) => {
            const key = typeof opt === "string" ? opt : opt.key ?? opt.name ?? opt.value;
            const value = typeof opt === "string" ? opt : opt.value ?? key;
            return { key: String(key), value: String(value) };
          });

          field.options = dropdownOptions;

          const matched = dropdownOptions.find(
            (opt) =>
              String(opt.value ?? "").toLowerCase() ===
              String(cf.customFieldValue ?? "").toLowerCase()
          );

          const selectedValue = matched?.value ?? "";
          selectedObj[valueKey] = selectedValue;
          setValue(valueKey, selectedValue);
        } else {
          const val = cf.customFieldValue ?? "";
          selectedObj[valueKey] = val;
          setValue(valueKey, val);
        }

        fields.push(field);
      });

      console.log("✅ Deal pipeline ID:", dealPipelineIdStr);
      console.log("✅ Raw customFields from API:", res.customFields);
      console.log("✅ Filtered fields for current pipeline:", filteredFields);
      console.log("✅ Fields ready to render:", fields);

      setOriginalCustomFields(res.customFields);
      setCustomFields(fields);
      setSelectedItem(selectedObj);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("❌ Failed to load custom fields", err);
      toast.error("Failed to load custom fields");
      setIsLoading(false);
    });
};

  const onChange = (value: any, item: any) => {
    const index = customFields.findIndex((f) => f.key === item.key);
    const valueKey = `value${index + 1}`;
    setValue(valueKey, value);
    setSelectedItem((prev) => ({ ...prev, [valueKey]: value }));
  };

  const deleteCustomField = () => {
    setShowDeleteDialog(false);
    const field = customFields[selectedFieldIndex];
    const id = originalCustomFields.find((o) => o.customField === field.key)?.customFieldId ?? 0;

    if (id > 0) {
      customFieldsService.delete(id).then(() => {
        toast.success("Custom field deleted");
        const updatedFields = [...customFields];
        updatedFields.splice(selectedFieldIndex, 1);
        setCustomFields(updatedFields);
        loadCustomFields();
      }).catch(() => {
        toast.error("Delete failed");
      });
    } else {
      const updatedFields = [...customFields];
      updatedFields.splice(selectedFieldIndex, 1);
      setCustomFields(updatedFields);
    }
  };

  const saveCustomFields = () => {
  const fieldsToSave: DealCustomFields[] = customFields.map((field, index) => {
    const cf = new DealCustomFields();
    cf.customFieldId = field.id ?? originalCustomFields.find(o => o.customField === field.key)?.customFieldId ?? 0;
    cf.dealID = dealItem.dealID;
    cf.customField = field.key;

    const isDropdown = field.type === ElementType.dropdown || field.type?.toLowerCase?.() === "singleoption";

    cf.customFieldType = isDropdown ? "singleOption" : "textbox";
    cf.customFieldValue = getValues(field.value);
    cf.createdBy = Util.UserProfile()?.userId;

    if (isDropdown && Array.isArray(field.options)) {
      cf.options = JSON.stringify(
        field.options.map(opt =>
          typeof opt === "string" ? { key: opt, value: opt } : opt
        )
      );
    }

    cf.pipelineIds = field.pipelineIds ?? "";

    return cf;
  });

  setIsLoading(true);

  customFieldsService.postItemBySubURL(fieldsToSave, "")
    .then(() => {
      toast.success("Custom fields saved successfully");
      loadCustomFields();
    })
    .catch(() => {
      toast.error("Failed to save custom fields");
    })
    .finally(() => setIsLoading(false));
};

  return (
    <FormProvider {...methods}>
      <div className="appdealblock-head">
        <div className="appblock-headcolleft">
          <button className="appblock-collapse">
            <span className="appblock-titlelabel">
              <FontAwesomeIcon icon={faAngleDown} /> Details
            </span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <>
          {customFields.length > 0 && (
            <GenerateElements
              controlsList={customFields}
              selectedItem={selectedItem}
              onChange={onChange}
              getSelectedList={() => []}
              getListofItemsForDropdown={getListofItemsForDropdown}
              onElementDelete={(index: number) => {
                setSelectedFieldIndex(index);
                setShowDeleteDialog(true);
              }}
              onElementEdit={(index: number) => {
                setSelectedFieldIndex(index);
                setDialogIsOpen(true);
              }}
            />
          )}

          <div>
            {customFields.length === 0 && <p>Add custom fields to include more deal information.</p>}
            <div className="d-flex">
              <div className="col-sm-10 pt-4">
               <button
  className="btn btn-secondary btn-sm"
  onClick={() => {
    setSelectedFieldIndex(-1);  // <== Ensure it's reset for 'Add'
    setDialogIsOpen(true);
  }}
>
  + Custom Field
</button>
              </div>
              <div className="col-sm-2 pt-4">
                <button
                  disabled={customFields.length === 0}
                  className="btn btn-primary btn-sm"
                  onClick={saveCustomFields}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {dialogIsOpen && (
        <DealCustomFieldAddEdit
          selectedFieldIndex={selectedFieldIndex}
          customFields={customFields}
          setCustomFields={setCustomFields}
          dialogIsOpen={dialogIsOpen}
          setDialogIsOpen={setDialogIsOpen}
          onFieldsSubmit={() => {}}
          refreshCustomFields={loadCustomFields}
          originalCustomFields={originalCustomFields} 

        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          itemType="Custom Field"
          itemName="Custom Field"
          dialogIsOpen={showDeleteDialog}
          closeDialog={() => setShowDeleteDialog(false)}
          onConfirm={deleteCustomField}
          isPromptOnly={false}
          actionType="Delete"
        />
      )}
    </FormProvider>
  );
};

export default DealDetailsCustomFields;
