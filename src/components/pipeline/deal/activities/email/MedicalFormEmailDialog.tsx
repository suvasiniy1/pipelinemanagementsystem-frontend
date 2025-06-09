import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import GenerateElements from "../../../../../common/generateElements";
import { IControl, ElementType } from "../../../../../models/iControl";
import { AddEditDialog } from "../../../../../common/addEditDialog";

const MedicalFormEmailDialog = ({ dialogIsOpen, selectedItem, onCloseDialog, onSend }: any) => {
  const methods = useForm();

  const controlsList: IControl[] = [
    { key: "To", value: "to", isRequired: true },
    { key: "From", value: "from", isRequired: true},
    { key: "Bcc", value: "bcc" },
    { key: "Subject", value: "subject", isRequired: true },
    { key: "Body", value: "body", type: ElementType.ckeditor, isRequired: true },
  ];

  const onSubmit = (formData: any) => {
    const emailData = {
      ...selectedItem,
      ...formData
    };
    onSend(emailData); // trigger the send
  };

  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header="Medical Form Email"
        onSave={methods.handleSubmit(onSubmit)}
        closeDialog={onCloseDialog}
        onClose={onCloseDialog}
      >
        <GenerateElements
          controlsList={controlsList}
          selectedItem={selectedItem}
          onChange={(val: any, field: any) => methods.setValue(field.value, val)}
        />
      </AddEditDialog>
    </FormProvider>
  );
};

export default MedicalFormEmailDialog;
