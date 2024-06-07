import React from "react";
import { ViewEditProps } from "../../../common/table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { AddEditDialog } from "../../../common/addEditDialog";
import Util from "../../../others/util";
import * as Yup from "yup";
import { ElementType, IControl } from "../../../models/iControl";
import GenerateElements from "../../../common/generateElements";
import { ContacteService } from "../../../services/contactService";
import { ErrorBoundary } from "react-error-boundary";
import { Contact } from "../../../models/contact";
import { toast } from "react-toastify";

const ContactsAddEditDialog: React.FC<ViewEditProps> = (props) => {
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

  const contactSvc = new ContacteService(ErrorBoundary);

  const controlsList: Array<IControl> = [
    {
      key: "First Name",
      value: "firstName",
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12
    },
    {
      key: "Last Name",
      value: "lastName",
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12
    },
    {
      key: "Email Address",
      value: "email",
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12,
      regex1:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errMsg1:"Please enter a valid email address"
    },
    {
      key: "Phone Number",
      type: ElementType.number,
      value: "phone",
      min:0,
      isRequired: true,
      isControlInNewLine:true,
      elementSize:12,
      regex1 : /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
      errMsg1:"Please enter a valid phone number"
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
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onChange = (value: any, item: any)=>{

  }

  const onSubmit = (item: any) => {
    let obj: Contact = { ...selectedItem };
    obj = Util.toClassObject(obj,item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.id = obj.id ?? 0;
    (obj.id>0 ? contactSvc.putItemBySubURL(obj, `${obj.id}`) : contactSvc.postItem(obj)).then(res=>{
        
        if(res){
            toast.success(`Contact ${obj.id>0 ? 'updated' : 'created'} successfully`);
            props.onSave();
        }
        setDialogIsOpen(false);
    }).catch(err=>{
        toast.success(`Unable to ${obj.id>0 ? 'update' : 'save'} contact `);
    })

  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={`${selectedItem.id>0 ? 'Edit' : 'Add'} Contact`}
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

export default ContactsAddEditDialog;
