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
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const stripHtml = (s: string) => (s || "").replace(/<[^>]*>/g, "");
const trimOrEmpty = (v: any) => (typeof v === "string" ? v.trim() : "");
const normalizeEmailList = (input: string | string[]) => {
  const csv = Array.isArray(input)
    ? (input as string[]).join(",")
    : String(input || "");
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const MedicalFormEmailDialog = ({ dialogIsOpen, selectedItem, onCloseDialog, onSend }: any) => {
  const methods = useForm<MedicalEmailForm>({
    mode: "onSubmit",
    defaultValues: {
      to:      trimOrEmpty(selectedItem?.to ?? selectedItem?.email ?? ""),
      from:    trimOrEmpty(selectedItem?.from ?? ""),
      bcc:     Array.isArray(selectedItem?.bcc) ? selectedItem.bcc.join(", ") : trimOrEmpty(selectedItem?.bcc ?? ""),
      subject: trimOrEmpty(selectedItem?.subject ?? ""),
      body:    selectedItem?.body ?? "",
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
    methods.register("to", {
      setValueAs: trimOrEmpty,
      validate: (v) => {
        if (!v) return "To is required";
        if (!emailRe.test(v)) return "To must be a valid email";
        return true;
      },
    });

    methods.register("from", {
      setValueAs: trimOrEmpty,
      validate: (v) => {
        if (!v) return "From is required";
        if (!emailRe.test(v)) return "From must be a valid email";
        return true;
      },
    });

   methods.register("bcc", {
    setValueAs: (v) => (typeof v === "string" ? v.trim() : ""),
    validate: (v: string) => {
      if (!v) return "Bcc is required";

      // ❌ do NOT allow any whitespace after a comma
      if (/,\s+/.test(v)) {
        return "Remove spaces after commas (use a@x.com,b@y.com)";
      }

      // Validate each address (no trimming here, we enforce the rule above)
      const parts = v.split(",");
      const bad = parts.find((e) => !emailRe.test(e));
      return bad ? `Invalid Bcc email: ${bad}` : true;
    },
  });

    methods.register("subject", {
      setValueAs: trimOrEmpty,
      validate: (v) => (v ? true : "Subject is required"),
    });

    methods.register("body", {
      validate: (v) => (trimOrEmpty(stripHtml(v)) ? true : "Body is required"),
    });
  }, [methods]);

  // Avoid unnecessary state churn on every keystroke
  const handleFieldChange = useCallback(
    (val: any, field: any) => {
      const name = field.value as Path<MedicalEmailForm>;
      // For these fields, trim as user types/changes
      if (name === "to" || name === "from" || name === "subject" || name === "bcc") {
        val = trimOrEmpty(val);
      }
      methods.setValue(name, val, { shouldDirty: true, shouldTouch: true, shouldValidate: false });
    },
    [methods]
  );

  const onSubmit = (formData: MedicalEmailForm) => {
    // Final sanitize before send
    const payload = {
      ...formData,
      to: trimOrEmpty(formData.to),
      from: trimOrEmpty(formData.from),
      subject: trimOrEmpty(formData.subject),
      bcc: normalizeEmailList(formData.bcc), // array of trimmed emails
      body: formData.body,                   // keep HTML
    };
    onSend(payload);
  };

  const onInvalid = (errors: any) => {
    const firstKey = Object.keys(errors)[0];
    toast.error(errors[firstKey]?.message || "Please fix the highlighted fields.");
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
        />
      </AddEditDialog>
    </FormProvider>
  );
};

export default MedicalFormEmailDialog;
