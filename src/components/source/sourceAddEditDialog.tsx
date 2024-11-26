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
import { Source } from "../../models/source";
import Util from "../../others/util";
import { SourceService } from "../../services/sourceService";

const SourceAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

  const sourceSvc = new SourceService(ErrorBoundary);

  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "sourceName",
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
    let obj: Source = { ...selectedItem };
    obj = Util.toClassObject(obj,item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.sourceID = obj.sourceID ?? 0;
    if(obj.sourceID>0){
      obj.createdDate = selectedItem?.createdDate;
      obj.modifiedBy = Util.UserProfile()?.userId;
      obj.modifiedDate = new Date();
    }
    (obj.sourceID>0 ? sourceSvc.putItemBySubURL(obj, `${obj.sourceID}`) : sourceSvc.postItemBySubURL(obj, "SaveSourceDetails")).then(res=>{
        
        if(res){
            toast.success(`Source ${obj.sourceID>0 ? 'updated' : 'created'} successfully`);
        }
        setLoadRowData(true);
        setDialogIsOpen(false);
    }).catch(err=>{
        toast.error(`Unable to ${obj.sourceID>0 ? 'update' : 'save'} Source `);
    })

  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={`${selectedItem.sourceID>0 ? 'Edit' : 'Add'} Source`}
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

export default SourceAddEditDialog;
