import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ElementType, IControl } from "../../../models/iControl";
import Util from "../../../others/util";

type params = {
  customFields: Array<IControl>;
  setCustomFields: any;
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
};
const DealCustomFieldAddEdit = (props: params) => {
  const {
    customFields,
    setCustomFields,
    dialogIsOpen,
    setDialogIsOpen,
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
  const { handleSubmit, unregister } = methods;

  const onChange = (value: any, item: any) => {};

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onSubmit = (item: any) => {
    
    setCustomFields((prev: Array<IControl>) => {
      
      let obj: any = {};
      obj.key = item.fieldName;
      obj.value = "value" + (prev.length + 1);
      obj.isControlInNewLine = true;
      obj.showDelete=true;
      obj.showSave=true;
      obj.isRequired=true;
      obj.elementSize=9;
      obj.type = item.fieldType == "textbox" ? null : item.fieldType;
      prev.push(obj);
      return prev;
    });
    setDialogIsOpen(false);
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
