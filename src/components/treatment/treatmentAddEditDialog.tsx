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
import { Treatment } from "../../models/treatment";
import Util from "../../others/util";
import { TreatmentService } from "../../services/treatmenetService";

const TreatmentAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

  const treatmentSvc = new TreatmentService(ErrorBoundary);

  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "treatmentName",
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12
    },
    {
      key: "Category",
      value: "category",
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12
    }
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
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onChange = (value: any, item: any)=>{

  }

  const onSubmit = (item: any) => {
    let obj: Treatment = { ...selectedItem };
    obj = Util.toClassObject(obj,item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.treatmentID = obj.treatmentID ?? 0;
    if(obj.treatmentID>0){
      obj.createdDate = selectedItem?.createdDate;
      obj.modifiedBy = Util.UserProfile()?.userId;
      obj.modifiedDate = new Date();
    }
    (obj.treatmentID>0 ? treatmentSvc.putItemBySubURL(obj, `${obj.treatmentID}`) : treatmentSvc.postItemBySubURL(obj, "SaveTreatmentDetails")).then(res=>{
        
        if(res){
            toast.success(`Treatment ${obj.treatmentID>0 ? 'updated' : 'created'} successfully`);
        }
        setLoadRowData(true);
        setDialogIsOpen(false);
    }).catch(err=>{
        toast.error(`Unable to ${obj.treatmentID>0 ? 'update' : 'save'} Treatment `);
    })

  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={`${selectedItem.treatmentID>0 ? 'Edit' : 'Add'} Treatment`}
            dialogSize={"m"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
          >
            <>
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
                      />
                    }
                    <br />
                  </div>
                </div>
              </div>
            </>
            <br />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default TreatmentAddEditDialog;
