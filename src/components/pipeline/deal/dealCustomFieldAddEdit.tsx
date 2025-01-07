import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ElementType, IControl } from "../../../models/iControl";
import Util from "../../../others/util";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { PipeLine } from "../../../models/pipeline";
import { getValue } from "@testing-library/user-event/dist/utils";
import { ErrorBoundary } from "react-error-boundary";
import { DealCustomFields } from "../../../models/deal";
import { CustomFieldService } from "../../../services/customFieldService";

type params = {
  customFields: Array<IControl>;
  setCustomFields: any;
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
  selectedFieldIndex: any;
  onFieldsSubmit: any;
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
  const allPipeLinesList: Array<PipeLine> = JSON.parse(
    localStorage.getItem("allPipeLines") as any
  );
  const [selectedPipeLines, setSelectedPipeLines] = useState([]);
  const customFieldsService = new CustomFieldService(ErrorBoundary);
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
    {
      key: "PipeLine",
      value: "pipelineIds",
      isRequired: true,
      type: ElementType.multiSelectDropdown,
      isControlInNewLine: true,
      bindable: "value",
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
  const { handleSubmit, unregister, setValue, getValues } = methods;

  const onChange = (value: any, item: any) => {
    if (item.key === "PipeLine") {
      setValue("pipelineIds" as never, value as never);
    }
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    if (selectedFieldIndex >= 0) {
      
      let selectedFieldItem: any = customFields[selectedFieldIndex];
      if (selectedFieldItem) {
        setValue("fieldName" as never, selectedFieldItem.key as never);
        setValue("fieldType" as never, selectedFieldItem.type as never);
        setValue("pipelineIds" as never, selectedFieldItem.pipelineId as never);
        let selectedList: Array<any> = [];

        ("" + selectedFieldItem.pipelineId)?.split(",").forEach((sp: any) => {
          let spItem = allPipeLinesList.find((apI) => apI.pipelineID == +sp);
          selectedList.push(spItem);
        });
        setSelectedPipeLines(selectedList as any);
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
      obj.value =
        "value" +
        (selectedFieldIndex == -1 ? prev.length + 1 : selectedFieldIndex + 1);
      obj.isControlInNewLine = true;
      obj.showDelete = true;
      obj.showEdit = true;
      obj.isRequired = true;
      obj.elementSize = 9;

      obj.pipelineIds = getValues("pipelineIds" as any);
      obj.type = item.fieldType;
      if (selectedFieldIndex == -1) {
        prev.push(obj);
        saveCustomFields(obj); //Saving fields at pipeline level if it is a new field
      } else {
        prev[selectedFieldIndex] = obj;
      }
      return prev;
    });
    if (!isDuplicateFound) setDialogIsOpen(false);
    if (selectedFieldIndex != -1) props.onFieldsSubmit(selectedFieldIndex);
  };

  const saveCustomFields = (item: any) => {
    //trigger().then((valid) => {
    //if (valid) {
    let obj: any = {};
    obj.id = 0 as any;
    obj.customField = item.key;
    obj.customFieldType = item.type;
    obj.pipelineIds = item.pipelineIds;
    obj.createdBy = Util.UserProfile()?.userId;
    customFieldsService
      .postItem(obj)
      .then((res) => {
        
        item.id = res?.result[0]?.id;
        let itemIndex = customFields.findIndex((i) => i.key === item.key);
        setCustomFields((prev: Array<IControl>) => {
          prev[itemIndex] = item;
          return prev;
        });
      })
      .catch((err) => {});
    //}
    //});
    return null;
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

    if (item.key === "PipeLine") {
      list =
        allPipeLinesList.map((item: PipeLine) => ({
          name: item.pipelineName,
          value: item.pipelineID,
        })) ?? [];
    }
    return list;
  };

  const getSelectedList = (e: any) => {
    return selectedPipeLines.map((item: PipeLine) => ({
      name: item?.pipelineName,
      value: item?.pipelineID,
    }));
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
            getSelectedList={(e: any) => getSelectedList(e)}
          />
        }
      </AddEditDialog>
    </FormProvider>
  );
};

export default DealCustomFieldAddEdit;
