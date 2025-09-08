import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
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


import { ForgotPasswordService } from "../../services/forgotPasswordService";
import { useNavigate, useLocation } from "react-router-dom"; // To get token and username from URL

import BackgroundImage from "../../resources/images/background.png";
import Logo from "../../resources/images/Clinic-Lead-White.png";
import jpg from "../../resources/images/Y1Logo.jpg";
import svg from "../../resources/images/Clinic-Lead-White.svg";

const PROGRESS_DURATION = 3; // seconds (same as ConfirmEmail)


const ChangePassword = () => {
  const [selectedItem, setSelectedItem] = useState(
    new UserCredentails(
      (LocalStorageUtil.getItem(Constants.User_Name) as any) ?? null
    )
  );
  const [isErrorChangingPassword, setIsErrorChangingPassword] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Capture token and username from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = (queryParams.get("token") || "").replace(/ /g, "+");
  const changePassword = queryParams.get("changePassword");
  const userId = queryParams.get("userId");
  console.log("tk:", token, "Username:", userId);
  const [linkStatus, setLinkStatus] =
  useState<"checking"|"valid"|"invalid"|"notoken">(userId && token ? "checking" : "notoken");

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
    .test("no-leading-trailing", "Password cannot start or end with spaces",
      v => v != null && v === v.trim())
    .test("no-spaces", "Password cannot contain spaces",
      v => !!v && !/\s/.test(v))
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPasswordHash: Yup.string()
    .required("Confirm Password is required")
    .test("no-leading-trailing", "Password cannot start or end with spaces",
      v => v != null && v === v.trim())
    .test("no-spaces", "Password cannot contain spaces",
      v => !!v && !/\s/.test(v))
    .oneOf([Yup.ref("passwordHash")], "Passwords must match"),
});

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async () => {
    setLoading(true);
    setMessage("");
    const formData = getValues();
const password = formData.passwordHash;          // no trim
const confirmPassword = formData.confirmPasswordHash; // no trim

    if (!password || !confirmPassword) {
  setIsErrorChangingPassword("Password is required");
  setLoading(false);
  return;
}
if (/\s/.test(password) || /\s/.test(confirmPassword)) {
  setIsErrorChangingPassword("Password cannot contain spaces");
  setLoading(false);
  return;
}
if (password !== confirmPassword) {
  setIsErrorChangingPassword("Passwords do not match");
  setLoading(false);
  return;
}

    try {
      setLoading(true);
      const response = await forgotPasswordService.resetPassword(
        token!, // Token from URL
        userId!, // Username from URL
        password
      );

      if (response) {
        toast.success("Password has been reset successfully.");

        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect to login after success
      }
    } catch (err: any) {
  const status = err?.response?.status;
  const apiMsg =
    err?.response?.data ||
    err?.message ||
    "Something went wrong while resetting the password.";
  setIsErrorChangingPassword(
    status === 410 ? (apiMsg || "This link is invalid or has expired.") : apiMsg
  );
} finally {
  setLoading(false);
}
  };

useEffect(() => {
  if (linkStatus !== "invalid") return;
  setElapsed(0);
  const t = setInterval(() => setElapsed(e => e + 0.05), 50);
  return () => clearInterval(t);
}, [linkStatus]);

// redirect after countdown
useEffect(() => {
  if (linkStatus !== "invalid") return;
  if (elapsed >= PROGRESS_DURATION) navigate("/login");
}, [elapsed, linkStatus, navigate]);

  const onChange = (value: any, item: any) => {
    let obj = { ...selectedItem };
    if (item.value === "passwordHash") obj.passwordHash = value;
    if (item.value === "confirmPasswordHash") obj.confirmPasswordHash = value;
    setSelectedItem(obj);
  };
useEffect(() => {
  if (!(userId && token)) return; // first-login flow has no token
  (async () => {
    try {
      await forgotPasswordService.validateReset(userId, token);
      setLinkStatus("valid");
    } catch (err: any) {
      const msg = err?.response?.data || "This link is invalid or has expired.";
      setIsErrorChangingPassword(msg);
      setLinkStatus("invalid");
    }
  })();
}, [userId, token]);
if (linkStatus === "checking") return <div className="alignCenter"><Spinner/></div>;
if (linkStatus === "invalid") {
  const palette = {
    bg: "linear-gradient(90deg,#ffdde1 0%,#ee9ca7 100%)",
    fg: "#d32f2f",
    shadow: "0 4px 24px rgba(233,67,67,0.12)",
    track: "#fbeaea",
    bar: "#e94b4b",
  };
  const progressPercent = Math.max(0, 100 - (elapsed / PROGRESS_DURATION) * 100);
  const countdown = Math.ceil(PROGRESS_DURATION - elapsed);

  return (
    <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: palette.bg,
        color: palette.fg,
        boxShadow: palette.shadow,
        borderRadius: 16,
        padding: "32px 40px",
        marginTop: 40,
        textAlign: "center",
        minWidth: 320,
        maxWidth: 420,
      }}>
        {/* ❌ red cross */}
        <svg width="64" height="64" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
          <circle cx="12" cy="12" r="12" fill={palette.bar} opacity="0.15" />
          <path d="M9 9l6 6M15 9l-6 6" stroke={palette.bar} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Link Expired</h2>
        <p style={{ fontSize: 18, marginBottom: 16 }}>
          {isErrorChangingPassword || "This link is invalid or has expired."}
        </p>

        <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
          Redirecting you to the login page in <b>{countdown}</b> second{countdown !== 1 ? "s" : ""}…
        </div>

        <div style={{ width: 120, height: 8, background: palette.track, borderRadius: 4, margin: "0 auto", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: palette.bar, transition: "width 0.05s linear" }} />
        </div>
      </div>
    </div>
  );
}
  return (
    <>
      <FormProvider {...methods}>
        <div className="sign-in__wrapper">
          <div className="signinwrapper-layout">
            <div className="signinwrapper-inner">
              {/* Overlay */}
              <div className="sign-in__backdrop"></div>
               <div className="logheader bggradiant">
                              {<div className="logo"><img className="lohheaderlogo" src={Logo} /></div>}
                              
                            </div>
              {/* Form */}
              <Form
                className="shadow p-4 bg-white rounded loginformblock"
                onSubmit={handleSubmit(onSubmitClick)}
              >
                {/* Header */}
                <div className="logformhead">
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
