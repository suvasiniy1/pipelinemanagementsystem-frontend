import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AddEditDialog } from "../../common/addEditDialog";
import GenerateElements from "../../common/generateElements";
import { ViewEditProps } from "../../common/table";
import { IControl } from "../../models/iControl";
import Util from "../../others/util";
import { PipeLineType } from "../../models/pipeLineType";
import { PipeLineTypeService } from "../../services/pipeLineTypeService";

const PipeLineTypeAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

  const pipelineTypeSvc = new PipeLineTypeService(ErrorBoundary);

  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "pipelineTypeName",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
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
  const { handleSubmit, unregister, register, resetField, setValue, setError } = methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onChange = (value: any, item: any) => {};

  const onSubmit = async (item: any) => {
    try {
      let obj: PipeLineType = { ...selectedItem };
      obj = Util.toClassObject(obj, item);
      obj.createdBy = Util.UserProfile()?.userId;
      obj.pipelineTypeID = obj.pipelineTypeID ?? 0;
      if (obj.pipelineTypeID > 0) {
        obj.createdDate = selectedItem?.createdDate;
        obj.modifiedBy = Util.UserProfile()?.userId;
        obj.modifiedDate = new Date();
      }
  
      let res;
  
      if (obj.pipelineTypeID > 0) {
        res = await pipelineTypeSvc.putItemBySubURL(obj, `${obj.pipelineTypeID}`);
      } else {
        res = await pipelineTypeSvc.postItemBySubURL(obj, "SavePipelineTypeDetails");
      }
  
      console.log("✅ Full Response:", res);
      console.log("✅ Response Data:", res?.data);
  
      toast.success(`Pipeline Type ${obj.pipelineTypeID > 0 ? "updated" : "created"} successfully`);
      setLoadRowData(true);
      setDialogIsOpen(false);
    } catch (err) {
      console.error("❌ onSubmit Error:", err);
      toast.error(`Unable to ${selectedItem?.pipelineTypeID > 0 ? 'update' : 'save'} Pipeline Type`);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <AddEditDialog
          dialogIsOpen={dialogIsOpen}
          header={`${selectedItem.pipelineTypeID > 0 ? "Edit" : "Add"} Pipeline Type`}
          dialogSize={"m"}
          onSave={handleSubmit(onSubmit)}
          closeDialog={oncloseDialog}
          onClose={oncloseDialog}
        >
          <div className="modelformfiledrow row">
            <div>
              <div className="modelformbox ps-2 pe-2">
                <GenerateElements
                  controlsList={controlsList}
                  selectedItem={selectedItem}
                  onChange={(value: any, item: any) => onChange(value, item)}
                />
                <br />
              </div>
            </div>
          </div>
        </AddEditDialog>
      </FormProvider>
    </>
  );
};

export default PipeLineTypeAddEditDialog;
