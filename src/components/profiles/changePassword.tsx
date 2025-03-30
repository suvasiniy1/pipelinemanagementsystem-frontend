import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import GenerateElements from "../../common/generateElements";
import { ElementType, IControl } from "../../models/iControl";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import Util from "../../others/util";
import { UserCredentails } from "../login";
import jpg from "../../resources/images/Y1Logo.jpg";
import BackgroundImage from "../../resources/images/background.png";
import Logo from "../../resources/images/logo.png";
import { ForgotPasswordService } from "../../services/forgotPasswordService";
import { useNavigate, useLocation } from "react-router-dom"; // To get token and username from URL

const ChangePassword = () => {
  const [selectedItem, setSelectedItem] = useState(
    new UserCredentails(
      (LocalStorageUtil.getItem(Constants.User_Name) as any) ?? null
    )
  );
  const [isErrorChangingPassword, setIsErrorChangingPassword] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Capture token and username from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = '';
  const changePassword = queryParams.get("changePassword");
  const username = queryParams.get("username");
  console.log("tk:", token, "Username:", username);

  const forgotPasswordService = new ForgotPasswordService((error: any) => {
    setIsErrorChangingPassword(error.message || "Something went wrong.");
  });

  const [controlsList, setControlsList] = useState<Array<IControl>>([
    {
      key: "Password",
      value: "passwordHash",
      tabIndex: 1,
      placeHolder: "Password",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.password,
      showEyeIcon: false,
      isRequired: true,
    },
    {
      key: "Confirm Password",
      value: "confirmPasswordHash",
      tabIndex: 2,
      placeHolder: "Confirm Password",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.password,
      showEyeIcon: false,
      isRequired: true,
    },
  ]);

  const validationsSchema = Yup.object().shape({
    passwordHash: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number"),
    confirmPasswordHash: Yup.string()
      .oneOf([Yup.ref("passwordHash")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async () => {
    setLoading(true);
    setMessage("");
    const formData = getValues(); // Get values from the form
    const password = formData.passwordHash;
    const confirmPassword = formData.confirmPasswordHash;

    // Ensure passwords match
    if (password !== confirmPassword) {
      setIsErrorChangingPassword("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPasswordService.resetPassword(
        token!, // Token from URL
        username!, // Username from URL
        password
      );

      if (response) {
        toast.success("Password has been reset successfully.");

        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect to login after success
      }
    } catch (error) {
      setIsErrorChangingPassword(
        "Something went wrong while resetting the password."
      );
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value: any, item: any) => {
    let obj = { ...selectedItem };
    if (item.value === "passwordHash") obj.passwordHash = value;
    if (item.value === "confirmPasswordHash") obj.confirmPasswordHash = value;
    setSelectedItem(obj);
  };

  return (
    <>
      <FormProvider {...methods}>
        <div
          className="sign-in__wrapper"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="signinwrapper-layout">
            <div className="signinwrapper-inner">
              {/* Overlay */}
              <div className="sign-in__backdrop"></div>
              <div className="logheader">
                {<img className="lohheaderlogo" src={jpg} alt="Y1 Logo" />}
              </div>
              {/* Form */}
              <Form
                className="shadow p-4 bg-white rounded loginformblock"
                onSubmit={handleSubmit(onSubmitClick)}
              >
                {/* Header */}
                <div className="logformhead">
                  <div className="logformheadimg">
                    <img className="img-thumbnail" src={Logo} alt="logo" />
                  </div>
                  <div className="h4">Change Password</div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span
                    className="text-danger"
                    hidden={!isErrorChangingPassword}
                  >
                    {isErrorChangingPassword}
                  </span>
                  <div hidden={!loading}>
                    <Spinner />
                  </div>
                </div>
                <br/>
                <div
                  hidden={!changePassword}
                  style={{
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                    border: "1px solid #ffeeba",
                  }}
                >
                  Your account has been created with a default password. You
                  must change it before proceeding.
                </div>
                {
                  <GenerateElements
                    controlsList={controlsList}
                    selectedItem={selectedItem}
                    disable={loading}
                    onChange={(value: any, item: any) => onChange(value, item)}
                  />
                }
                <br />
                {!loading ? (
                  <Button className="w-100" variant="primary" type="submit">
                    Submit
                  </Button>
                ) : (
                  loading && (
                    <Button
                      className="w-100"
                      variant="primary"
                      type="submit"
                      disabled
                    >
                      Changing password...
                    </Button>
                  )
                )}
              </Form>
            </div>
          </div>
        </div>
      </FormProvider>
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
