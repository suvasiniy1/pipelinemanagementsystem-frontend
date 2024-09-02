import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ViewEditProps } from "../../../common/table";
import { ElementType, IControl } from "../../../models/iControl";
import Util from "../../../others/util";
import TemplatePreview from "./templatePreview";
import RichTextEditor from "../../../elements/richTextEditor";
import { EmailTemplate } from "../../../models/emailTemplate";
import { EmailTemplateService } from "../../../services/emailTemplateService";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import SelectDropdown from "../../../elements/SelectDropdown";

const TemplatesAddEditDialog: React.FC<ViewEditProps> = (props) => {
  
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

  const [isLoading, setIsLoading] = useState(true);
  const editorsList = [
    { key: "Header", value: "header" },
    { key: "Body", value: "body" },
    { key: "Footer", value: "footer" },
  ];

  const alignDropdownValues = [
    { name: "Left", value: "left" },
    { name: "Center", value: "center" },
    { name: "Right", value: "right" },
  ];
  const templateSvc = new EmailTemplateService(ErrorBoundary);

  const controlsList1: Array<IControl> = [
    {
      key: "Name",
      value: "name",
      isRequired: true,
    }
  ];

  const controlsList2: Array<IControl> = [
    {
      key: "Header",
      value: "header",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.ckeditor,
    },
    {
      key: "Body",
      value: "body",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.ckeditor,
    },
    {
      key: "Footer",
      value: "footer",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.ckeditor,
    },
  ];

  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const formOptions = {
    resolver: yupResolver(getValidationsSchema(controlsList1.concat(controlsList2))),
  };
  const methods = useForm(formOptions);
  const { handleSubmit, unregister, register, resetField, setValue, setError } =
    methods;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    
    if (selectedItem && selectedItem.id > 0) {
      let obj = {
        ...selectedItem,
        header: JSON.parse(selectedItem.header),
        body: JSON.parse(selectedItem.body),
        footer: JSON.parse(selectedItem.footer),
      };

      setSelectedItem(obj);
      setTimeout(() => {
        
        controlsList1.forEach((c) => {
          resetValidationsOnLoad(c.value, obj[c.value]);
        });
        controlsList2.forEach((c) => {
          resetValidationsOnLoad(c.value, obj[c.value]?.content);
        });
        setIsLoading(false);
      }, 100);
    } else setIsLoading(false);
  }, []);

  const resetValidationsOnLoad = (key: any, value: any) => {
    setValue(key as never, value as never);
  };

  const onChange = (value: any, item: any, itemName?:any, isValidationOptional:boolean=false) => {

    if(!isValidationOptional){
      setValue(item.value as never, value as never);
      if (value) unregister(item.value as never);
      else register(item.value as never);
      resetField(item.value as never);
    }


    let selectedItemObj = selectedItem as EmailTemplate;
    if (item.key === "Header") {
      let headerObj = selectedItemObj.header;
      if(itemName === "content") headerObj.content = value;
      else headerObj.position = value;
      setSelectedItem({ ...selectedItem, header: headerObj });
    }
    if (item.key === "Body") {
      let bodyObj = selectedItemObj.body;
      if(itemName === "content") bodyObj.content = value;
      else bodyObj.position = value;
      setSelectedItem({ ...selectedItem, body: bodyObj });
    }

    if (item.key === "Footer") {
      let footerObj = selectedItemObj.footer;
      if(itemName === "content") footerObj.content = value;
      else footerObj.position = value;;
      setSelectedItem({ ...selectedItem, footer: footerObj });
    }
  };

  const onSubmit = (item: any) => {
    let obj: EmailTemplate = { ...selectedItem };
    obj.name=item.name;
    obj.header = JSON.stringify(selectedItem.header) as any;
    obj.body = JSON.stringify(selectedItem.body) as any;
    obj.footer = JSON.stringify(selectedItem.footer) as any;
    obj.createdBy = Util.UserProfile()?.userId;
    obj.id = obj.id ?? 0;
    obj.categoryId = 0;
    console.log("ItemToSave");
    console.log(obj);
    (obj.id > 0
      ? templateSvc.putItemBySubURL(obj, `${obj.id}`)
      : templateSvc.postItem(obj)
    )
      .then((res) => {
        toast.success(
          `Template ${obj.id > 0 ? "updated" : "created"}  successfully`
        );
        setDialogIsOpen(false);
      })
      .catch((err) => {
        toast.error(`Unable to ${obj.id > 0 ? "update" : "save"} template`);
      });
  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            dialogSize={"xl"}
            isFullscreen={true}
            header={"Add EmailConfiguration"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
          >
            
            <>
              {isLoading ? (
                <div className="alignCenter">
                  <Spinner />
                </div>
              ) : (
                <div className="row d-flex" hidden={isLoading}>
                  <div className="col-6">
                    {
                      <>
                        <GenerateElements
                          controlsList={controlsList1}
                          selectedItem={selectedItem}
                          onChange={(value: any, item: any) =>
                            onChange(value, item)
                          }
                        />
                        <br/>
                        <div className="accordion" id="accordionExample">
                          {/* Header Accordion */}
                          {editorsList.map((editor, index) => (
                            <>
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id={"heading" + index}
                                >
                                  <button
                                    className="accordion-button"
                                    style={{ paddingLeft: "10px" }}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={"#collapse" + index}
                                    aria-expanded="true"
                                    aria-controls={"#collapse" + index}
                                  >
                                    {editor.key}
                                  </button>
                                </h2>
                                <div
                                  id={"collapse" + index}
                                  className={
                                    "accordion-collapse collapse " +
                                    (index == 0 ? "show" : "")
                                  }
                                  aria-labelledby={"heading" + index}
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body">
                                    {
                                      <>
                                        <div>
                                          <div className="form-group row">
                                            <div className="col-6">
                                              <label
                                                htmlFor="name"
                                                id={`labelFor_${editor.value}`}
                                                className="col-sm-6"
                                              >
                                                Position:
                                              </label>
                                            </div>
                                            <div className="col-6">
                                              <SelectDropdown
                                                list={alignDropdownValues}
                                                isValidationOptional={true}
                                                hideSelect={true}
                                                value={
                                                  selectedItem?.[editor.value]
                                                    ?.position ?? "center"
                                                }
                                                onItemChange={(e: any) =>
                                                  onChange(
                                                    e,
                                                    editor,
                                                    "position",
                                                    true
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <RichTextEditor
                                          onChange={(e: any) =>
                                            onChange(e, editor, "content")
                                          }
                                          item={controlsList2[index]}
                                          value={
                                            selectedItem?.[editor.value]
                                              ?.content
                                          }
                                        />
                                      </>
                                    }
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    }
                    
                  </div>
                  <div className="col-6">
                    <TemplatePreview selectedItem={selectedItem} setHieghtWidth={false}/>
                  </div>
                </div>
              )}
            </>
            {/* <SelectDropdown isValidationOptional={true} 
                                item={selectedItem} 
                                selectedItem={selectedItem} 
                                list={getDueDates()}/> */}
            {/* <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                    value={selectedItem.noteDetails} /> */}
            <br />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default TemplatesAddEditDialog;
