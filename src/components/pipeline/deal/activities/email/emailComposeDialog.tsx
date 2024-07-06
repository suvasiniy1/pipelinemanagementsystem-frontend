import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import Util from "../../../../../others/util";
import { AddEditDialog } from "../../../../../common/addEditDialog";
import { ElementType, IControl } from "../../../../../models/iControl";
import GenerateElements from "../../../../../common/generateElements";
import { useEffect } from "react";

const EmailComposeDialog = (props: any) => {
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
    fromAddress,
    ...others
  } = props;

  const controlsList: Array<IControl> = [
    {
      key: "To",
      value: "toAddress",
      isRequired: true,
      regex1:/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}(?:\s*[,;]\s*[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7})*$/,
      errMsg1:"Please enter valid email addresses"
    },
    {
      key: "CC",
      value: "cc",
    },
    {
      key: "Bcc",
      value: "bcc",
    },
    {
      key: "From",
      value: "fromAddress",
      disabled:true,
      isRequired: true,
    },
    {
      key: "Subject",
      value: "subject",
      isRequired: true,
    },
    {
      key: "Body",
      value: "body",
      type: ElementType.ckeditor,
      isRequired:true
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

  useEffect(()=>{
    
    let toAddresses = Array.from(selectedItem.toRecipients ?? [], (x:any)=>x?.emailAddress?.address).join(";");
    let obj = {...selectedItem, "fromAddress":fromAddress?.username, "toAddress":toAddresses,
      "body":selectedItem.body?.content, "subject":selectedItem.subject ? "Re: "+selectedItem.subject : null
    };
    setSelectedItem(obj);
    controlsList.forEach((c) => {
      resetValidationsOnLoad(c.value, obj[c.value]);
    });
  },[])

  const resetValidationsOnLoad = (key: any, value: any) => {
    setValue(key as never, value as never);
  };

  const onChange = (
    value: any,
    item: any,
    itemName?: any,
    isValidationOptional: boolean = false
  ) => {
    if (!isValidationOptional) {
      if(item.key==="Body"){
        setSelectedItem({ ...selectedItem, "body": value })
      }
      else{
        setValue(item.value as never, value as never);
        if (value) unregister(item.value as never);
        else register(item.value as never);
        resetField(item.value as never);
      }

    }
  };

  const onSubmit = (item: any) => {
    
    props.onSave(item);
  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={"Email"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
          >
            <GenerateElements
              controlsList={controlsList}
              selectedItem={selectedItem}
              onChange={(value: any, item: any) => onChange(value, item)}
            />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default EmailComposeDialog;
