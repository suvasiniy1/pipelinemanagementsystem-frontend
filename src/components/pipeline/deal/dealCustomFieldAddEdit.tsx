import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ElementType, IControl } from "../../../models/iControl";
import Util from "../../../others/util";
import { toast } from "react-toastify";
import { useEffect } from "react";

type params = {
  customFields: Array<IControl>;
  setCustomFields: any;
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
  selectedFieldIndex: any;
  onFieldsSubmit:any;
};
const DealCustomFieldAddEdit = (props: params) => {
  const {
    customFields,
    setCustomFields,
    dialogIsOpen,
    setDialogIsOpen,
    selectedFieldIndex,
    onFieldsSubmit,
    ...others
  } = props;
  const selectedItem = {};

  const controlsList: Array<IControl> = [
    {
      key: "Field Name",
      value: "fieldName",
      isRequired: true,
      isControlInNewLine: true,
    },
    {
      key: "Field Type",
      value: "fieldType",
      isRequired: true,
      type: ElementType.dropdown,
      isControlInNewLine: true,
    },
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList)),
  };
  const methods = useForm(formOptions);
  const { handleSubmit, unregister, setValue } = methods;

  const onChange = (value: any, item: any) => {};

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    
    if (selectedFieldIndex >= 0) {
      let selectedFieldItem = customFields[selectedFieldIndex];
      if (selectedFieldItem) {
        setValue("fieldName" as never, selectedFieldItem.key as never);
        setValue("fieldType" as never, selectedFieldItem.type as never);
      }
    }
  }, [selectedFieldIndex]);

  const onSubmit = (item: any) => {
    let isDuplicateFound = false;
    
    setCustomFields((prev: Array<IControl>) => {
      isDuplicateFound = prev.some(
        (i, index) => i.key === item.fieldName && selectedFieldIndex != index
      );
      if (isDuplicateFound && selectedFieldIndex == -1) {
        toast.warn(
          "Custom field with same Name has already been added, please try different Name"
        );
        return prev;
      }

      let obj: any = {};
      obj.key = item.fieldName;
      obj.value = "value" + (selectedFieldIndex == -1 ? prev.length + 1 : selectedFieldIndex+1);
      obj.isControlInNewLine = true;
      obj.showDelete = true;
      obj.showEdit = true;
      obj.isRequired = true;
      obj.elementSize = 9;
      obj.type = item.fieldType == "textbox" ? null : item.fieldType;
      if (selectedFieldIndex == -1) {
        prev.push(obj);
      } else {
        prev[selectedFieldIndex] = obj;
      }
      return prev;
    });
    if (!isDuplicateFound) setDialogIsOpen(false);
    if(selectedFieldIndex != -1) props.onFieldsSubmit(selectedFieldIndex);
  };

  const getDropdownValues = (item: any) => {
    let list: Array<any> = [];
    if (item.key === "Field Type") {
      var enumArray: Array<any> = [];
      Object.entries(ElementType).forEach(([key, value]) =>
        enumArray.push({ key: key, value: value })
      );
      list =
        enumArray.map((item: any) => ({
          name: item.value,
          value: item.value,
        })) ?? [];
    }
    return list;
  };

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header={"Add Custom Field"}
        dialogSize={"lg"}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        onSave={handleSubmit(onSubmit)}
        customSaveChangesButtonName={
          selectedFieldIndex >= 0 ? "Update" : "Save"
        }
      >
        {
          <GenerateElements
            controlsList={controlsList}
            selectedItem={selectedItem}
            onChange={(value: any, item: any) => onChange(value, item)}
            getListofItemsForDropdown={(e: any) => getDropdownValues(e)}
          />
        }
      </AddEditDialog>
    </FormProvider>
  );
};

export default DealCustomFieldAddEdit;
