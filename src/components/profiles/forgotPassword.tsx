import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { AddEditDialog } from "../../common/addEditDialog";
import GenerateElements from "../../common/generateElements";
import { ElementType, IControl } from "../../models/iControl";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import Util from "../../others/util";
import { UserCredentails } from "../login";

type params = {
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
};
const ForgotPassword = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen, ...others } = props;
  const [selectedItem, setSelectedItem] = useState(
    new UserCredentails(
      (LocalStorageUtil.getItem(Constants.User_Name) as any) ?? null
    )
  );
  const [isErrorChangingPassword, setIsErrorChangingPassword] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [controlsList, setControlsList] = useState<Array<IControl>>([
    {
      key: "User Name",
      value: "userName",
      tabIndex: 1,
      isControlInNewLine: true,
      isRequired: true,
    },
    {
      key: "Email",
      value: "email",
      tabIndex: 2,
      isControlInNewLine: true,
      isRequired: true,
    },
  ]);

  const validationsSchema = Yup.object().shape({
    ...Util.buildValidations(controlsList),
  });

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async (item: any) => {};

  const onChange = (value: any, item: any) => {
    let obj = { ...selectedItem };
    if (item.value == "passwordHash") obj.passwordHash = value;
    if (item.value == "confirmPasswordHash") obj.confirmPasswordHash = value;
    setSelectedItem(obj);
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onSubmit = () => {};
  return (
    <FormProvider {...methods}>
      <AddEditDialog
        dialogIsOpen={dialogIsOpen}
        header={"Forgot Password"}
        closeDialog={oncloseDialog}
        onClose={oncloseDialog}
        customSaveChangesButtonName="Submit"
        onSave={handleSubmit(onSubmit)}
      >
        {
          <GenerateElements
            controlsList={controlsList}
            selectedItem={selectedItem}
            onChange={(value: any, item: any) => onChange(value, item)}
          />
        }
      </AddEditDialog>
    </FormProvider>
  );
};

export default ForgotPassword;
