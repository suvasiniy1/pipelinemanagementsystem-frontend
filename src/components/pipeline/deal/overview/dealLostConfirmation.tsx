import React, { useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import * as Yup from "yup";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { AddEditDialog } from "../../../../common/addEditDialog";
import GenerateElements from "../../../../common/generateElements";
import { ViewEditProps } from "../../../../common/table";
import { Contact } from "../../../../models/contact";
import { IControl, ElementType } from "../../../../models/iControl";
import Util from "../../../../others/util";
import { ContacteService } from "../../../../services/contactService";
import { DealService } from "../../../../services/dealService";
import { Deal } from "../../../../models/deal";

const DealLostConfirmationDialog: React.FC<ViewEditProps> = (props) => {
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

  const dealSvc = new DealService(ErrorBoundary);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef(false);

  const lostDealReasons = [
    { value: "price_too_high", name: "Price Too High" },
    { value: "chose_competitor", name: "Chose Competitor" },
    { value: "lack_of_budget", name: "Lack of Budget" },
    { value: "no_decision", name: "No Decision Made" },
    { value: "product_fit_issue", name: "Product Fit Issue" },
    { value: "internal_priorities_changed", name: "Internal Priorities Changed" },
    { value: "lack_of_engagement", name: "Lack of Engagement" },
    { value: "technical_constraints", name: "Technical Constraints" },
    { value: "poor_timing", name: "Poor Timing" }
  ];

  const controlsList: Array<IControl> = [
    {
      key: "Reason",
      value: "reason",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.dropdown,
    },
    {
      key: "Comments",
      value: "comments",
      isRequired: true,
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.textarea,
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

  const onChange = (value: any, item: any) => {};

  const onSubmit = async (item: any) => {
  if (isSubmitting || submitRef.current) return;

  setIsSubmitting(true);
  submitRef.current = true;

  // Find the display name for the selected reason
  const selectedReason = lostDealReasons.find(r => r.value === item["reason"]);
  const reasonDisplayName = selectedReason ? selectedReason.name : item["reason"];

  const updatedDeal: Partial<Deal> = {
    statusID: 3,
    isClosed: true,
    modifiedDate: new Date(),
    reason: reasonDisplayName,
    comments: item["comments"],
  };

  try {
    // ✅ Let parent handle actual update
    await props.onSave(updatedDeal);
    setDialogIsOpen(false);
  } catch (error) {
    console.error("Unable to mark deal as lost", error);
    toast.error("Unable to mark deal as lost");
  } finally {
    setIsSubmitting(false);
    submitRef.current = false;
  }
};

  const getDropdownvalues = (item: any) => {
    if (item.key === "Reason") {
      return (
        lostDealReasons.map(({ name, value }) => ({
          name: name,
          value: value,
        })) ?? []
      );
    }
  };
  return (
    <>
      {
        <FormProvider {...methods}>
          <AddEditDialog
            dialogIsOpen={dialogIsOpen}
            header={header}
            dialogSize={"m"}
            onSave={handleSubmit(onSubmit)}
            closeDialog={oncloseDialog}
            onClose={oncloseDialog}
            saveButtonProps={{ disabled: isSubmitting }}
          >
            <>
              <div className="modelformfiledrow row">
                <div>
                  <div className="modelformbox ps-2 pe-2">
                    {
                      <GenerateElements
                        controlsList={controlsList}
                        selectedItem={selectedItem}
                        getListofItemsForDropdown={(e: any) =>
                          getDropdownvalues(e) as any
                        }
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

export default DealLostConfirmationDialog;
