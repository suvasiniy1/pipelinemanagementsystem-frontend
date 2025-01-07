import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import Util from "../../../../../others/util";
import { AddEditDialog } from "../../../../../common/addEditDialog";
import { ElementType, IControl } from "../../../../../models/iControl";
import GenerateElements from "../../../../../common/generateElements";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import LocalStorageUtil from "../../../../../others/LocalStorageUtil";
import Constants from "../../../../../others/constants";
import { EmailItemProps, EmailTemplate } from "../../../../../models/emailTemplate";

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
  const { instance, accounts } = useMsal();

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
      isRequired:true,
      hideSpaceForEditor:true
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

  function addReToSubject(subject:any) {
    // Trim whitespace from the beginning and end of the subject
    subject = subject.trim();

    // Check if subject already starts with "Re:"
    if (!subject.startsWith("Re:")) {
        // If not, prepend "Re:" to the subject
        subject = `Re: ${subject}`;
    }

    return subject;
}

  useEffect(()=>{
    
    let toAddresses = selectedItem?.sender?.emailAddress?.address;
    let obj = {...selectedItem, "fromAddress":fromAddress?.username, "toAddress":toAddresses,
      "body":selectedItem?.body?.content, "subject":selectedItem.subject ? addReToSubject(selectedItem.subject) : null, "isReply": !Util.isNullOrUndefinedOrEmpty(selectedItem.subject)
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
      if (item.key === "Body") {
        value = value==="<p><br></p>" ? null : value;
        setSelectedItem({ ...selectedItem, body: value });
        setValue(item.value as never, value as never);
        if (value) unregister(item.value as never);
        else register(item.value as never);
        resetField(item.value as never);
      }

    }
  };

  const onSubmit = (item: any) => {
    
    let obj = Util.toClassObject(selectedItem, item);
    
    props.onSave(obj);
  };

  const getAttachedData=()=>{
    let list:Array<EmailTemplate> = JSON.parse(LocalStorageUtil.getItemObject(Constants.EMAIL_TEMPLATES) as any);
    
    let itemList:Array<any>=[];
    list.forEach((i) => {
      ;
      let header: EmailItemProps = JSON.parse(i.header as any);
      let body = JSON.parse(i.body as any);
      let footer = JSON.parse(i.footer as any);
      let value = `<div class="email-header" style="text-align: ${header.position};">${header.content}
      <div class="email-body" style="text-align: ${body.position};">${body.content}
      <div class="email-footer" style="text-align: ${header.position};">${footer.content}`;

      let obj = { name: i.name, value: value };
      itemList.push(obj);
    });

    return itemList;
  }

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
          ><br/>

            <GenerateElements
              controlsList={controlsList}
              selectedItem={selectedItem}
              onChange={(value: any, item: any) => onChange(value, item)}
              getAttachedData={(e:any)=>getAttachedData()}
            />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default EmailComposeDialog;
