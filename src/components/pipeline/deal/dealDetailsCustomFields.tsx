import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import GenerateElements from "../../../common/generateElements";
import { Deal, DealCustomFields } from "../../../models/deal";
import Util from "../../../others/util";
import DealCustomFieldAddEdit from "./dealCustomFieldAddEdit";
import { toast } from "react-toastify";
import { CustomFieldsService } from "../../../services/customFieldsService";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "react-bootstrap";
import { DeleteDialog } from "../../../common/deleteDialog";

type params = {
  dealItem: Deal;
  setDealItem: any;
};
const DealDetailsCustomFields = (props: params) => {
  const { dealItem, setDealItem, ...others } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<any>(-1);
  const [isCustomFieldModified, setIsCustomFieldModified]=useState(false);
  const [originalCustomFields, setOriginalCustomFields] = useState<
    Array<DealCustomFields>
  >([]);
  const customFieldsService = new CustomFieldsService(ErrorBoundary);
  const getValidationsSchema = (list: Array<any>) => {
    return Yup.object().shape({
      ...Util.buildValidations(list),
    });
  };

  const [formOptions, setFormOptions] = useState({
    resolver: yupResolver(getValidationsSchema(customFields)),
  });
  const methods = useForm(formOptions);
  const {
    handleSubmit,
    unregister,
    trigger,
    clearErrors,
    getValues,
    setValue,
    register,
  } = methods;

  const onChange = (value: any, item: any) => {
    
    let hasValueModified=false;
    let index = customFields.findIndex((i:any)=>i.key===item.key);
    setValue(("value" + index+1) as never, value as never);
    originalCustomFields.forEach((originalItem, index) => {
      if (hasValueModified) return;
      hasValueModified =
        originalItem.customSelectValues !=
        getValues(("value" + index+1) as never);
    });
    setIsCustomFieldModified(originalCustomFields.length!=customFields.length || hasValueModified)
  };

  const getSelectedList = (e: any) => {
    return [];
  };

  useEffect(()=>{
    if(!dialogIsOpen){
      setSelectedFieldIndex(-1 as any);
    }
  }, [dialogIsOpen])

  useEffect(() => {
    loadCustomFields();
  }, []);

  const loadCustomFields = () => {
    setIsLoading(true);
    customFieldsService
      .getCustomFields(dealItem.dealID)
      .then((res: any) => {
        let customFieldsList: Array<any> = [];
        res.customFields.forEach((i: DealCustomFields) => {
          setValue(
            ("value" + (customFieldsList.length+1)) as never,
            i.customSelectValues as never
          );
          let obj: any = {};
          obj.key = i.customField;
          obj.value = "value" + (customFieldsList.length+1);
          obj.isControlInNewLine = obj.showDelete = obj.showEdit = obj.isRequired = true;
          obj.pipelineIds = i.pipelineIds;
          obj.elementSize = 9;
          obj.type =
            i.customFieldValue == "textbox" ? null : i.customFieldValue;
          customFieldsList.push(obj);
        });
        setOriginalCustomFields(res.customFields);
        setCustomFields([...customFieldsList] as any);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Error retreving custom fields for selected Deal");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setFormOptions({
      resolver: yupResolver(getValidationsSchema(customFields)),
    });
    setIsCustomFieldModified(originalCustomFields.length!=customFields.length);
  }, [customFields.length]);

  const deleteCustomField = () => {
    setShowDeleteDialog(false);
    let controlsList = customFields;
    let customField = customFields[selectedFieldIndex] as any;
    let id = originalCustomFields.find((o) => o.customField === customField.key)
      ?.id as any;
    if (id > 0) {
      customFieldsService
        .delete(id)
        .then((res) => {
          if (res) {
            setValue(
              ("value" + (selectedFieldIndex + 1)) as never,
             null as never
            );
            toast.success("Custom field deleted successfully");
            clearErrors();
            controlsList.splice(selectedFieldIndex, 1);
            setCustomFields([...controlsList]);
            loadCustomFields();
          }
        })
        .catch((err) => {
          toast.error("Unable to delete custom field");
        });
    } else {
      controlsList.splice(selectedFieldIndex, 1);
      setCustomFields([...controlsList]);
      clearErrors();
    }
  };

  const saveCustomFields = () => {
    //trigger().then((valid) => {
      //if (valid) {
        let customFieldsList: Array<DealCustomFields> = [];
        customFields.forEach((field: any, index) => {
          let obj = new DealCustomFields();
          obj.id = originalCustomFields.find((o) => o.customField === field.key)
            ?.id as any;
          obj.dealID = dealItem.dealID;
          obj.customField = field.key;
          obj.customFieldValue = field.type;
          obj.customSelectValues = getValues(field.value as never);
          obj.pipelineIds = field.pipelineIds;
          obj.createdBy = Util.UserProfile()?.userId;
          customFieldsList.push(obj);
        });
        console.log(customFieldsList);
        setIsLoading(true);
        customFieldsService
          .postItemBySubURL(customFieldsList, "")
          .then((res) => {
            setIsLoading(false);
            if (res) {
              toast.success("Deal custom fields added/updated successfully");
              loadCustomFields();
            }
          })
          .catch((err) => {
            toast.error("Unable to add custom field, please verify");
            setIsLoading(false);
          });
      //}
    //});
    return null;
  };

  const canAddNewField = async () => {
    
    trigger().then((valid) => {
      if (!valid) {
        toast.warn("Please fill all the fields before adding new one");
      }
      return setDialogIsOpen(valid);
    });
  };

  const hideDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const canSave=(selectedFieldIndex:number)=>{
    let hasValueModified=false;
    originalCustomFields.forEach((originalItem, index)=>{
      if(hasValueModified) return;
      let currentItem = customFields[index] as any;
      hasValueModified = (originalItem.customSelectValues !=currentItem.value) ||  originalItem.customFieldValue !=currentItem.customFieldValue
    })
    setIsCustomFieldModified(originalCustomFields.length!=customFields.length || hasValueModified);
    setValue(
      ("value" + (selectedFieldIndex+1)) as never,
      null as never
    );
    register(("value" + (selectedFieldIndex+1)) as never);

  }

  return (
    <FormProvider {...methods}>
      <div className="appdealblock-head">
        <div className="appblock-headcolleft">
          <button className="appblock-collapse">
            <span className="appblock-titlelabel">
              <FontAwesomeIcon icon={faAngleDown} /> Details
            </span>
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <>
          <div hidden={customFields.length == 0}>
            {
              <GenerateElements
                controlsList={customFields}
                selectedItem={new DealCustomFields()}
                onChange={(value: any, item: any) => onChange(value, item)}
                getSelectedList={(e: any) => getSelectedList(e)}
                onElementDelete={(e: any) => {
                  setSelectedFieldIndex(e);
                  setShowDeleteDialog(true);
                }}
                onElementEdit={(e: any) => {
                  setSelectedFieldIndex(e);
                  setDialogIsOpen(true);
                }}
              />
            }
          </div>

          <div>
            <div hidden={customFields.length > 0}>
              <p>Add custom fields to include more details about the deal.</p>
            </div>

            <div className="d-flex">
              <div className="col-sm-10 pt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e: any) => canAddNewField()}
                >
                  + Custom Field
                </button>
              </div>
              <div className="col-sm-2 pt-4">
                <button
                  disabled={customFields.length == 0}
                  className="btn btn-primary btn-sm"
                  onClick={(e: any) => saveCustomFields()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {dialogIsOpen && (
        <DealCustomFieldAddEdit
          selectedFieldIndex={selectedFieldIndex}
          customFields={customFields}
          setCustomFields={setCustomFields}
          dialogIsOpen={dialogIsOpen}
          setDialogIsOpen={setDialogIsOpen}
          onFieldsSubmit={(e:any)=>canSave(e)}
        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          itemType={"Custom Field"}
          itemName={"Custom Field"}
          dialogIsOpen={showDeleteDialog}
          closeDialog={hideDeleteDialog}
          onConfirm={deleteCustomField}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      )}
    </FormProvider>
  );
};

export default DealDetailsCustomFields;
