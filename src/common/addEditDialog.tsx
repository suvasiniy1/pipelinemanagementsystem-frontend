import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Util from "../others/util";

type Props = {
  isNewItem?: boolean;
  header?: any;
  onSave?: any;
  onClose?: any;
  dialogIsOpen: any;
  closeDialog: any;
  canSave?: boolean;
  customFooter?: any;
  onFormChange?: any;
  customHeader?: any;
  dialogSize?: any;
  customSaveChangesButtonName?: string;
  children?: any;
  disabled?: boolean;
  isFullscreen?: boolean;
  showSaveButton?: boolean;
  canClose?: boolean;
  hideBody?:boolean;
  position?:string;
};

export const AddEditDialog: React.FC<Props> = (props) => {
  console.log("AddEditDialog - props: ", props);
  const [dialogIsOpen, setDialogIsOpen] = useState(props.dialogIsOpen);
  const {
    customSaveChangesButtonName,
    header,
    customHeader,
    onSave,
    canClose,
    onClose,
    closeDialog,
    canSave,
    children,
    customFooter,
    onFormChange,
    disabled,
    hideBody,
    position,
    showSaveButton = true,
    ...rest
  } = props;
  const [dialogSize, setDialogSize] = useState(
    props.dialogSize == "default" ? null : props.dialogSize ?? "lg"
  );
  const [fullScreen, setFullScreen] = useState<any>(
    props.isFullscreen ?? false
  );
  useEffect(() => {
    setDialogIsOpen(props.dialogIsOpen);
  }, [props.dialogIsOpen]);

  const onFormChange1 = () => {
    if (props.onFormChange) props.onFormChange();
  };

  return (
    <div>
      <Modal
        className={`modalpopup modalpopupadddeal ${position === "top" ? "modal-top" : ""}`}
        animation={false}
        show={dialogIsOpen}
        onHide={closeDialog}
        aria-labelledby="contained-modal-title-vcenter"
        size={dialogSize as any}
        fullscreen={fullScreen}
        backdrop="static"
        keyboard={false} // this was added to disable click outside of Modal window
        centered={position !== "top"} // only center if not top
      >
        {!canClose && !Util.isNullOrUndefinedOrEmpty(canClose)? (
          <Modal.Header className="modalhead">
            <Modal.Title className="modalheadtitle" id="dialogHeader">
              {customHeader ?? header}
            </Modal.Title>
          </Modal.Header>
        ) : (
          <Modal.Header className="modalhead" closeButton>
            <Modal.Title className="modalheadtitle" id="dialogHeader">
              {customHeader ?? header}
            </Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body className="modalbody" hidden={hideBody}>
          <form
            className="DialogForm"
            id="AddEditForm"
            onChange={(e) => onFormChange1()}
          >
            <fieldset disabled={disabled}>{children}</fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer className="modalfoot">
          <div className="modalfootbar" hidden={customFooter}>
            <button
              onClick={closeDialog}
              disabled={!canClose && !Util.isNullOrUndefinedOrEmpty(canClose)}
              className="btn btn-secondary btn-sm me-2"
              id="closeDialog"
            >
              Cancel
            </button>
            {showSaveButton && ( // Conditionally render the Save button
              <button
                type="submit"
                className={`btn btn-primary btn-sm save${header}`}
                onClick={onSave}
              >
                {customSaveChangesButtonName
                  ? customSaveChangesButtonName
                  : props.isNewItem
                  ? "Create"
                  : "Save"}
              </button>
            )}
          </div>
          {customFooter}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
