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
import { Clinic } from "../../models/clinic";
import { ClinicService } from "../../services/clinicService";

const ClinicAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

  const clinicSvc = new ClinicService(ErrorBoundary);

  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "clinicName",
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
    let obj: Clinic = { ...selectedItem };
    obj = Util.toClassObject(obj,item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.clinicID = obj.clinicID ?? 0;
    if(obj.clinicID>0){
      obj.createdDate = selectedItem?.createdDate;
      obj.modifiedBy = Util.UserProfile()?.userId;
      obj.modifiedDate = new Date();
    }
    (obj.clinicID>0 ? clinicSvc.putItemBySubURL(obj, `${obj.clinicID}`) : clinicSvc.postItemBySubURL(obj, "SaveClinicDetails")).then(res=>{
        
        if(res){
            toast.success(`Clinic ${obj.clinicID>0 ? 'updated' : 'created'} successfully`);
        }
        setLoadRowData(true);
        setDialogIsOpen(false);
    }).catch(err=>{
        toast.error(`Unable to ${obj.clinicID>0 ? 'update' : 'save'} Clinic `);
    })

  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={`${selectedItem.clinicID>0 ? 'Edit' : 'Add'} Clinic`}
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

export default ClinicAddEditDialog;
