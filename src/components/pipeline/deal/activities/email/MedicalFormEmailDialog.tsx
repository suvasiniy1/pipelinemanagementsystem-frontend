import { useEffect, useCallback } from "react";
import { useForm, FormProvider, Path } from "react-hook-form";
import { toast } from "react-toastify";
import GenerateElements from "../../../../../common/generateElements";
import { AddEditDialog } from "../../../../../common/addEditDialog";
import { ElementType } from "../../../../../models/iControl";

type MedicalEmailForm = {
  to: string;
  from: string;
  bcc: string;     // comma-separated in the UI
  subject: string;
  body: string;    // HTML if using CKEditor
};

const stripHtml = (s: string) => (s || "").replace(/<[^>]*>/g, "").trim();

const MedicalFormEmailDialog = ({ dialogIsOpen, selectedItem, onCloseDialog, onSend }: any) => {
  const methods = useForm<MedicalEmailForm>({
    mode: "onSubmit",
    defaultValues: {
      to: selectedItem?.to ?? selectedItem?.email ?? "",
      from: selectedItem?.from ?? "",
      bcc: Array.isArray(selectedItem?.bcc) ? selectedItem.bcc.join(", ") : (selectedItem?.bcc ?? ""),
      subject: selectedItem?.subject ?? "",
      body: selectedItem?.body ?? "",
    },
  });

  const controlsList = [
    { key: "To",      value: "to",      isRequired: true },
    { key: "From",    value: "from",    isRequired: true },
    { key: "Bcc",     value: "bcc",     isRequired: true }, // set to false if optional
    { key: "Subject", value: "subject", isRequired: true },
    { key: "Body",    value: "body",   type: ElementType.ckeditor,  isRequired: true }, // CKEditor field
  ] as const;

  // Register ONCE (no shadow inputs)
  useEffect(() => {
    methods.register("to",      { required: "To field is required",      validate: v => v?.trim() ? true : "To field is required" });
    methods.register("from",    { required: "From field is required" });
    methods.register("bcc",     { required: "Bcc field is required" }); // flip to false if optional
    methods.register("subject", { required: "Subject field is required" });
    methods.register("body",    { required: "Body field is required",    validate: v => stripHtml(v) ? true : "Body field is required" });
  }, [methods]);

  // Avoid unnecessary state churn on every keystroke
  const handleFieldChange = useCallback(
    (val: any, field: any) => {
      const name = field.value as Path<MedicalEmailForm>;
      if (methods.getValues(name) !== val) {
        methods.setValue(name, val, { shouldDirty: true, shouldTouch: true });
      }
    },
    [methods]
  );

  const onSubmit = (formData: MedicalEmailForm) => {
    const emailData = {
      ...selectedItem,
      ...formData,
      bcc: formData.bcc.split(",").map(s => s.trim()).filter(Boolean),
    };
    onSend(emailData);
  };

  const onInvalid = (errors: any) => {
    const firstKey = Object.keys(errors)[0];
    toast.error(errors[firstKey]?.message || "Please fill the required fields.");
  };

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header="Medical Form Email"
        onSave={methods.handleSubmit(onSubmit, onInvalid)}
        closeDialog={onCloseDialog}
        onClose={onCloseDialog}
        customSaveChangesButtonName="Send"
      >
        <GenerateElements
          controlsList={controlsList as any}
          selectedItem={selectedItem}
          onChange={handleFieldChange}
          // If you can, have GenerateElements read errors from RHF context
          // and display errors[name]?.message below each field.
        />
      </AddEditDialog>
    </FormProvider>
  );
};

export default MedicalFormEmailDialog;
