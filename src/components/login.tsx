import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import GenerateElements from "../common/generateElements";
import { ElementType, IControl } from "../models/iControl";
import { UserProfile } from "../models/userProfile";
import Constants from "../others/constants";
import LocalStorageUtil from "../others/LocalStorageUtil";
import Util, { IsMockService } from "../others/util";
import BackgroundImage from "../resources/images/background.png";
import Logo from "../resources/images/Clinic-Lead-White.png";
import jpg from "../resources/images/Y1Logo.jpg";
import svg from "../resources/images/Clinic-Lead-White.svg";
import { LoginService } from "../services/loginService";
import ForgotPassword from "./profiles/forgotPassword";

export class UserCredentails {
  public userName!: string;
  public password!:string;
  public passwordHash!: string;
  public confirmPasswordHash!: string;
  public email!: string;
  public userId: number = 0;

  constructor(
    userName: string = null as any,
    passwordHash: string = null as any,
    email: string = "" as any,
    userId: number = 0
  ) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.passwordHash = passwordHash;
  }
}

const Login = () => {
  const [showForGotPasswordDiglog, setShowForGotPasswordDiglog] =
    useState(false);
  const [isIncorrectCredentails, setIsIncorrectCredentails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false); // For 2FA check
  const [verificationCode, setVerificationCode] = useState(""); // Holds 2FA code input by user
  const [userId, setUserId] = useState<number | null>(null); // To hold the userId for the second step of 2FA

  const [selectedItem, setSelectedItem] = useState(
    new UserCredentails(
      LocalStorageUtil.getItem(Constants.REMEMBER_ME) === "true"
        ? (LocalStorageUtil.getItem(Constants.User_Name) as any) ?? null
        : null
    )
  );
  const [disablePassword, setDisablePassword] = useState<boolean>(true);
  const [disableLogin, setDisableLogin]=useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState(false);
  const loginSvc = new LoginService(ErrorBoundary);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loginError, setLoginError]=useState();

  const [controlsList, setControlsList] = useState<Array<IControl>>([
    {
      key: "Email",
      value: "email",
      isRequired: true,
      tabIndex: 1,
      isFocus: true,
      placeHolder: "Email",
      isControlInNewLine: true,
      elementSize: 12,
    },
    {
      key: "Password",
      value: "passwordHash",
      readOnly: true,
      tabIndex: 2,
      placeHolder: "Password",
      isControlInNewLine: true,
      elementSize: 12,
      type: ElementType.password,
      showEyeIcon: false,
      autoComplete:"new-password",
    },
  ]);

  const validationsSchema = Yup.object().shape({
    ...Util.buildValidations(controlsList),
  });


   const convertTZ = (dateTime: any) => {
     return moment(new Date(Util.toLocalTimeZone(dateTime))).format(
       "MM/DD/YYYY hh:mm:ss a"
     ) as any;
   };

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async (item: any) => {
    let obj = Util.toClassObject(new UserCredentails(), item);
    obj.password = obj.passwordHash;
    obj.userName = obj.email;
    setLoading(true);

    // Only use the username and password
    console.log(`Username :${obj.userName}, Password :${obj.passwordHash}`);

    if (rememberMe) {
      LocalStorageUtil.setItem(Constants.REMEMBER_ME, "true");
      LocalStorageUtil.setItem(Constants.User_Name, obj.userName);
    } else {
      LocalStorageUtil.removeItem(Constants.REMEMBER_ME);
      LocalStorageUtil.removeItem(Constants.User_Name);
    }

    if (obj.userName.toLocaleLowerCase() !== "developer") {
      if (IsMockService()) {
        LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
        navigate("/pipeline");
      } else {
        loginSvc
          .login(obj)
          .then((res: UserProfile) => {
            setLoading(false);
            
            if(res?.forcePasswordReset){
              navigate(`/changePassword?userId=${res.encryptedUserId}&changePassword=true`);
              return;
            }
            if (res && res?.token) {
              LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
              LocalStorageUtil.setItem(Constants.ACCESS_TOKEN, res?.token);
              LocalStorageUtil.setItem(Constants.User_Name, res?.user);
              LocalStorageUtil.setItem(
                Constants.TOKEN_EXPIRATION_TIME,
                convertTZ(res?.expires)
              );
              LocalStorageUtil.setItemObject(
                Constants.USER_PROFILE,
                res as any
              );
              console.log("User Role from response:", res?.role); // 👈 Add this line
              LocalStorageUtil.setItem(Constants.USER_Role, res?.role as any);
              const profile = {
                user: res.user,
                email: res.email,
                userId: res.userId,
                role: res.role, // ✅ use role or roleId
              };
              LocalStorageUtil.setItemObject(Constants.USER_PROFILE, profile);
              console.log("Saved user profile after login:", profile);
              
              // Load navigation items for the user's role
              Util.loadNavItemsForUser(res.role);
              
              navigate("/pipeline");
            } else if (res?.twoFactorRequired) {
              toast.success(
                "2FA code sent to your email! Please check your inbox."
              );
              LocalStorageUtil.setItemObject(Constants.USER_PROFILE, {
                user: res.user,
                email: res.email,
                userId: res.userId,
                role: res.role, // ✅ this is correct
              });
          
              setTwoFactorRequired(true);
              setUserId(res.userId);
              setEmail(res.email);
            } else {
              setLoginError(res as any);
              setIsIncorrectCredentails(true);
            }
          })
          .catch((err) => {
              
            setLoading(false);
            toast.error(err);
          });
      }
    }
  };

  const handlePassword = () => {
    navigate("/forgot-password"); // Redirect to the Forgot Password page
  };

  function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const onChange = (value: any, item: any) => {
    
    let obj = { ...selectedItem };
    if (item.value == "email") obj.email = value;
    if (item.value == "passwordHash") obj.passwordHash = value;

    setSelectedItem(obj);
    setDisableLogin(Util.isNullOrUndefinedOrEmpty(obj.email) || Util.isNullOrUndefinedOrEmpty(obj.passwordHash));

    let cntrlList = [...controlsList];
    cntrlList[1].isRequired = obj.userName !== "developer";
    cntrlList[1].disabled=Util.isNullOrUndefinedOrEmpty(obj.email);
    setControlsList([...cntrlList]);
    setValue("email" as never, obj.email as never);
    setValue("passwordHash" as never, obj.passwordHash as never);
  };

  const handleVerifyClick = async () => {
    if (userId === null || email === null) {
      // Check both userId and email
      toast.error("User ID or Email is not available");
      return;
    }

    setLoading(true);
    try {
      await loginSvc
        .verifyTwoFactorCode({ userId, verificationCode, email })
        .then((res: any) => {
          if (res?.token) {
            LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
            LocalStorageUtil.setItem(Constants.ACCESS_TOKEN, res?.token);
            LocalStorageUtil.setItem(Constants.User_Name, res?.user);
           LocalStorageUtil.setItem(Constants.USER_Role, res?.role);
           LocalStorageUtil.setItem(
            Constants.TOKEN_EXPIRATION_TIME,
           convertTZ(res?.expires)
            );
             LocalStorageUtil.setItemObject(Constants.USER_PROFILE, {
                user: res.user,
                email: res.email,
               userId: res.userId,
               role: res.role
             });
             
             // Load navigation items for the user's role
             Util.loadNavItemsForUser(res.role);
             
            navigate("/pipeline"); // Navigate to the next screen after successful verification
          } else {
            toast.error("Invalid verification code.");
          }
        });
    } catch (error) {
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LocalStorageUtil.removeItem(Constants.USER_LOGGED_IN);
    LocalStorageUtil.removeItem(Constants.ACCESS_TOKEN);
    LocalStorageUtil.removeItem(Constants.TOKEN_EXPIRATION_TIME);
    if (LocalStorageUtil.getItem(Constants.REMEMBER_ME) === "true") {
      setRememberMe(true);
    }
  }, []);

  return (
    <>
      <FormProvider {...methods}>
        {/* <div
          className="sign-in__wrapper"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        > */}
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
                  className="loginformblock"
                  onSubmit={handleSubmit(onSubmitClick)}
                >
                <div className="shadow p-5 bg-white rounded loginformblock-row">
                  {/* Header */}
                  <div className="logformhead">
                    {/* <div className="logformheadimg">
                      <img className="img-thumbnail" src={Logo} alt="logo" />
                    </div> */}
                    <h1 className="h1">Sign In</h1>
                    <p>to access CRM</p>
                    {/* <p>You must become a member to login and access the entire site.</p> */}
                  </div>
                  <div className="logformsubtext p-2 text-center">
                    {loading ? "Please wait" : twoFactorRequired
                      ? "Enter the 2FA code sent to your email"
                      : loginError
                        ? <span style={{ color: '#d32f2f', fontWeight: 'bold', background: '#fff0f0', borderRadius: '4px', padding: '6px 12px', display: 'inline-block', boxShadow: '0 1px 4px rgba(211,47,47,0.08)' }}>
                            {loginError}
                          </span>
                        : null}
                  </div>
                  {twoFactorRequired ? (
                    // If 2FA is required, show the verification code form
                    <>
                      <Form.Group controlId="verificationCode">
                        <Form.Control
                          type="text"
                          placeholder="Enter Verification Code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                      <br/>
                      <Button
                        className="w-100"
                        variant="primary"
                        type="button"
                        disabled={loading}
                        onClick={handleVerifyClick}
                      >
                        {loading ? "Verifying..." : "Verify Code"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <GenerateElements
                        controlsList={controlsList}
                        selectedItem={selectedItem}
                        disable={loading}
                        onChange={(value: any, item: any) =>
                          onChange(value, item)
                        }
                      />
                    {/*   <Form.Group className="mb-2" controlId="checkbox">
                        <Form.Check
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e: any) => setRememberMe(!rememberMe)}
                          disabled={Util.isNullOrUndefinedOrEmpty(
                            selectedItem.userName
                          )}
                          tabIndex={3}
                          label="Remember me"
                        />
                      </Form.Group>*/}
                      {!loading ? (
                        <Button className="w-100 btngradiant" variant="primary" type="submit">
                          Log In
                        </Button>
                      ) : (
                        loading && (
                          <Button
                            className="w-100 btngradiant"
                            variant="primary"
                            type="submit"
                            disabled
                          >
                            Logging In...
                          </Button>
                        )
                      )}

                      <div className="d-grid justify-content-end">
                        <Button
                          className="text-muted px-0"
                          variant="link"
                          onClick={(e: any) => setShowForGotPasswordDiglog(true)}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      {/* 
                      <div className="oraccessquickly text-center mt-3 mb-3">
                        <span>or access quickly</span>
                      </div>
                      */}
                      {/* 
                      <div className="oraccessquicklybtn">
                        <a className="btn" href="#">
                          Google
                        </a>
                        <a className="btn" href="#">
                          SSO
                        </a>
                      </div>
                      */}
                    </>
                  )}
                </div>
              </Form>              
            </div>
          </div>
          <div className="loginfooter">
            <div className="container">
              <div className="loginfooter-inner">
                <div className="loginfooter-row">
                  <div className="loginfooter-lang">
                    <select>
                      <option>Language</option>
                      <option selected>English (US)</option>
                    </select>
                  </div>
                  <div className="loginfooter-social">
                    {/* <ul className='socialmedia'>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faFacebook} /></a></li>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faXTwitter} /></a></li>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faLinkedin} /></a></li>
                    </ul> */}
                  </div>
                </div>
                <div className="loginfooter-btmlink">
                  <ul className="loginfooter-link">
                    <li>
                      <a href="#">Terms of Service</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
      <ToastContainer />
      {showForGotPasswordDiglog && (
        <ForgotPassword
          dialogIsOpen={showForGotPasswordDiglog}
          setDialogIsOpen={setShowForGotPasswordDiglog}
        />
      )}
    </>
  );
};

export default Login;
