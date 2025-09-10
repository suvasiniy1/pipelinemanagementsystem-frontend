import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { AddEditDialog } from "../../common/addEditDialog";
import GenerateElements from "../../common/generateElements";
import { IControl } from "../../models/iControl";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import Util from "../../others/util";
import { UserCredentails } from "../login";
import { ForgotPasswordService } from "../../services/forgotPasswordService";
import { toast } from "react-toastify";

// Define the type of form data
interface ForgotPasswordFormData {
  email: string;

}

type params = {
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
};

const ForgotPassword = (props: params) => {
  const { dialogIsOpen, setDialogIsOpen } = props;
  const [selectedItem, setSelectedItem] = useState(
    new UserCredentails(
      (LocalStorageUtil.getItem(Constants.User_Name) as any) ?? null
    )
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const forgotPasswordService = new ForgotPasswordService((err: any) => {
    setError(err.message || 'Something went wrong.');
  });

  const [controlsList, setControlsList] = useState<Array<IControl>>([
   /* {
      key: "User Name",
      value: "userName",
      tabIndex: 1,
      isControlInNewLine: true,
      isRequired: true,
    },*/
    {
      key: "Email",
      value: "email",
      tabIndex: 2,
      isControlInNewLine: true,
      isRequired: true,
      regex1: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errMsg1: "Please enter a valid email address",
    },
  ]);

  // Updated validation schema to type the form correctly
  const validationsSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    /*userName: Yup.string().required("User Name is required"),*/
  });

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm<ForgotPasswordFormData>(formOptions); // Type useForm with ForgotPasswordFormData
  const { handleSubmit, getValues, setValue } = methods;
function getApiErrorMessage(err: any) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Request failed";
  if (typeof data === "string") return data;
  return data.message || data.detail || data.title || "Request failed";
}
  // onSubmit function that will call the forgot password service
  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    const formData = getValues(); // Now TypeScript knows formData contains 'email' and 'userName'
    const email = formData.email;

    try {
      const response = await forgotPasswordService.sendResetLink(email);
      if (response) {
       // setMessage('Password reset link has been sent to your email.');
        toast.success("Password reset link has been sent to your email.");
        setDialogIsOpen(false);  
      }
    } catch (err) {
  const msg = getApiErrorMessage(err);
  toast.error(msg);
    } finally {
      setLoading(false);
          setDialogIsOpen(false);
    }
  };

  const oncloseDialog = () => {
    setDialogIsOpen(false);
  };

  const onChange = (value: any, item: any) => {
    let obj = { ...selectedItem };
    if (item.value === "email") obj.email = value;
    setSelectedItem(obj);
  };

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
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
