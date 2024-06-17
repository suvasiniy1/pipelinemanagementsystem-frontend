import React from "react";
import { AddEditDialog } from "../../../common/addEditDialog";
import { EmailTemplate } from "../../../models/emailTemplate";
import TemplatePreview from "../template/templatePreview";

type params = {
  dialogIsOpen: any;
  setDialogIsOpen: any;
  templateItem: EmailTemplate;
};

const TemplatePreviewDialog = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen, templateItem, ...others } = props;

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const customFooter = () => {
    return (
      <>
        <div className="modalfootbar">
          <button
            onClick={oncloseDialog}
            className="btn btn-secondary btn-sm me-2"
            id="closeDialog"
          >
            Close
          </button>
        </div>
      </>
    );
  };
  return (
    <AddEditDialog
      dialogSize={"xl"}
      isFullscreen={true}
      dialogIsOpen={dialogIsOpen}
      header={"Template Preview"}
      closeDialog={oncloseDialog}
      onClose={oncloseDialog}
      customFooter={customFooter()}
    >
      <TemplatePreview selectedItem={templateItem} setHieghtWidth={false} />
    </AddEditDialog>
  );
};

export default TemplatePreviewDialog;
