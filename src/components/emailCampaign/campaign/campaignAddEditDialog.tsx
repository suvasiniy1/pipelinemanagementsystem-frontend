import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AddEditDialog } from "../../../common/addEditDialog";
import GenerateElements from "../../../common/generateElements";
import { ViewEditProps } from "../../../common/table";
import { Campaign } from "../../../models/campaign";
import { ElementType, IControl } from "../../../models/iControl";
import Util, { IsMockService } from "../../../others/util";
import { CampaignService } from "../../../services/campaignSerivce";
import { MuiColorInput } from "mui-color-input";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Constants from "../../../others/constants";
import { Utility } from "../../../models/utility";

const CampaignAddEditDialog: React.FC<ViewEditProps> = (props) => {
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
  const templateSvc = new CampaignService(ErrorBoundary);
  const [selectedColor, setSelectedColor]=useState("");
  const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
  const controlsList: Array<IControl> = [
    {
      key: "Name",
      value: "name",
      sidebyItem: "Owner",
      isRequired: true,
    },
    {
      key: "Owner",
      value: "owner",
      isSideByItem: true,
      type:ElementType.dropdown
    },
    {
      key: "Color",
      value: "color",
      type: ElementType.custom,
      sidebyItem: "Goal",
    },
    {
      key: "Goal",
      value: "goal",
      isSideByItem: true,
    },
    {
      key: "Start Date",
      value: "startDate",
      type: ElementType.datepicker,
      sidebyItem: "End Date",
    },
    {
      key: "End Date",
      value: "endDate",
      type: ElementType.datepicker,
      isSideByItem: true,
    },
    {
      key: "Audience",
      value: "audience",
      sidebyItem: "Notes",
    },
    {
      key: "Notes",
      value: "notes",
      isSideByItem: true,
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

  useEffect(() => {
    if (selectedItem && selectedItem.id > 0) {
      let obj = {
        ...selectedItem
      };

      setSelectedItem(obj);
      setTimeout(() => {
        controlsList.forEach((c) => {
          resetValidationsOnLoad(c.value, obj[c.value]);
        });
        setIsLoading(false);
      }, 100);
    } else setIsLoading(false);
  }, []);

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
      setValue(item.value as never, value as never);
      if (value) unregister(item.value as never);
      else register(item.value as never);
      resetField(item.value as never);
    }

    if (item.key === "owner") {
      setSelectedItem({ ...selectedItem, startDate: value });
    }

    if (item.key === "Start Date") {
      setSelectedItem({ ...selectedItem, startDate: value });
    }
    if (item.key === "End Date") {
      setSelectedItem({ ...selectedItem, endDate: value });
    }
  };

  const onSubmit = (item: any) => {
    let obj: Campaign = { ...selectedItem };
    obj = Util.toClassObject(obj,item);
    obj.createdBy = Util.UserProfile()?.userId;
    obj.id = obj.id ?? 0;
    console.log("ItemToSave");
    console.log(obj);
    (obj.id > 0
      ? templateSvc.putItemBySubURL(obj, `${obj.id}`)
      : IsMockService() ? templateSvc.postItemBySubURL(obj, "mockData/campaigns.json") :  templateSvc.postItem(obj)
    )
      .then((res) => {
        toast.success(
          `Campaign ${obj.id > 0 ? "updated" : "created"}  successfully`
        );
        setDialogIsOpen(false);
      })
      .catch((err) => {
        toast.error(`Unable to ${obj.id > 0 ? "update" : "save"} campaign`);
      });
  };

  const customElement = (e:any) => {
    return (
      <>
        <MuiColorInput format="hex" value={selectedColor} onChange={setSelectedColor} />
      </>
    );
  };

  const getDropdownValues = (item:any) => {
    return (
      item.key==="Owner" ? utility?.persons.map((item:any) => ({ "name": item.personName, "value": item.personID })) ?? [] : []
    );
  };

  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={`${selectedItem.id>0 ? "Edit" : "Add"} Campaign`}
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
                <div className="modelformfiledrow row">
                  <div className="modelformbox ps-2 pe-2">
                    {
                      <>
                        <GenerateElements
                          controlsList={controlsList}
                          selectedItem={selectedItem}
                          onChange={(value: any, item: any) =>
                            onChange(value, item)
                          }
                          getCustomElement={(e: any) => customElement(e)}
                          getListofItemsForDropdown={(e: any) =>
                            getDropdownValues(e)
                          }
                        />
                      </>
                    }
                    
                  </div>
                </div>
              )}
            </>
            <br />
          </AddEditDialog>
        </FormProvider>
      }
    </>
  );
};

export default CampaignAddEditDialog;
