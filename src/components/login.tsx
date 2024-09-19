import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import GenerateElements from "../common/generateElements";
import { ElementType, IControl } from "../models/iControl";
import LocalStorageUtil from '../others/LocalStorageUtil';
import Constants from '../others/constants';
import Util, { IsMockService } from "../others/util";
import BackgroundImage from "../resources/images/background.png";
import Logo from "../resources/images/logo.png";
import jpg from "../resources/images/Y1Logo.jpg";
import { LoginService } from '../services/loginService';
import { UserProfile } from '../models/userProfile';


export class UserCredentails {
  public userName!: string;
  public passwordHash!: string;
  public email!: string;
  public userId: number = 0;

  constructor(userName: string = null as any,
    passwordHash: string = null as any,
    email: string = null as any,
    userId: number = 0) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.passwordHash = passwordHash;
  }

}

const Login = () => {

  const [isUserNotExist, setIsUserNotExist] = useState(false);
  const [isIncorrectCredentails, setIsIncorrectCredentails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false); // For 2FA check
  const [verificationCode, setVerificationCode] = useState(''); // Holds 2FA code input by user
  const [userId, setUserId] = useState<number | null>(null);// To hold the userId for the second step of 2FA
  const [selectedItem, setSelectedItem] = useState(new UserCredentails(LocalStorageUtil.getItem(Constants.REMEMBER_ME) === "true" ? LocalStorageUtil.getItem(Constants.User_Name) as any ?? null : null));
  const [disablePassword, setDisablePassword] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState(false);
  const loginSvc = new LoginService(ErrorBoundary);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  const [controlsList, setControlsList] = useState<Array<IControl>>([
    { "key": "User Name", "value": "userName", "isRequired": true, "tabIndex": 1, "isFocus": true, "placeHolder": "User Name", "isControlInNewLine": true, "elementSize": 12 },
    { "key": "Password", "value": "passwordHash", "disabled": false, "tabIndex": 2, "placeHolder": "Password", "isControlInNewLine": true, "elementSize": 12, "type":ElementType.password, "showEyeIcon":false },
  ]);

  const validationsSchema = Yup.object().shape({
    ...Util.buildValidations(controlsList)
  });

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async (item: any) => {
    let obj = Util.toClassObject(new UserCredentails(), item);
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
  
    loginSvc.login(obj).then((res: UserProfile) => {
      console.log("Login Response: ", res); 
      setLoading(false);
      if (res && res?.token) {
        LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
        LocalStorageUtil.setItem(Constants.ACCESS_TOKEN, res?.token);
        LocalStorageUtil.setItem(Constants.User_Name, res?.user);
        LocalStorageUtil.setItem(Constants.TOKEN_EXPIRATION_TIME, Util.convertTZ(res?.expires));
        LocalStorageUtil.setItemObject(Constants.USER_PROFILE, res as any);
        navigate("/pipeline");
      } else if (res?.twoFactorRequired) {
        toast.success("2FA code sent to your email! Please check your inbox.");

    // Store partial user profile in local storage even if 2FA is required
    LocalStorageUtil.setItemObject(Constants.USER_PROFILE, {
      user: res.user,
      email: res.email,
      userId: res.userId
    });
        setTwoFactorRequired(true);
        setUserId(res.userId);
        setEmail(res.email); 
      } else {
        setIsIncorrectCredentails(res);
      }
    }).catch(err => {
      setLoading(false);
      toast.error(err);
    });
  };

  const handlePassword = () => { };

  function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const onChange = (value: any, item: any) => {
    let obj = { ...selectedItem };
    if (item.value == "userName") obj.userName = value;
    if (item.value == "passwordHash") obj.passwordHash = value;

    setSelectedItem(obj);
    setDisablePassword(Util.isNullOrUndefinedOrEmpty(obj.userName));
    let cntrlList = [...controlsList];
    cntrlList[1].isRequired = obj.userName !== "developer";
    setControlsList([...cntrlList]);
  }
  const handleVerifyClick = async () => {
    if (userId === null || email === null) { // Check both userId and email
      toast.error("User ID or Email is not available");
      return;
    }
  
    setLoading(true);
    try {
      await loginSvc.verifyTwoFactorCode({ userId, verificationCode, email }).then((res: any) => {
        if (res?.token) {
          LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
          LocalStorageUtil.setItem(Constants.ACCESS_TOKEN, res?.token);
          LocalStorageUtil.setItem(Constants.User_Name, res?.user);
          LocalStorageUtil.setItem(Constants.TOKEN_EXPIRATION_TIME, res?.expires);
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
  }, [])

  return (
    <>
      <FormProvider {...methods}>
        <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
          <div className='signinwrapper-layout'>
            <div className='signinwrapper-inner'>
              <div className="sign-in__backdrop"></div>
              <div className='logheader'>
                  <img className='lohheaderlogo' src={jpg} alt="logo" />
              </div>
              
              {/* Show form depending on 2FA state */}
              <Form className="shadow p-4 bg-white rounded loginformblock" onSubmit={handleSubmit(onSubmitClick)}>
                <div className='logformhead'>
                  <div className='logformheadimg'>
                    <img className="img-thumbnail" src={Logo} alt="logo" />
                  </div>
                  <div className="h4">Sign In</div>
                </div>
                <div className='logformsubtext p-2 text-center'>
                  {twoFactorRequired ? 'Enter the 2FA code sent to your email' : 'Please log in to continue.'}
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
                    <Button
                      className="w-100"
                      variant="primary"
                      type="button"
                      disabled={loading}
                      onClick={handleVerifyClick}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </Button>
                  </>
                ) : (
                  <>
                    <GenerateElements
                      controlsList={controlsList}
                      selectedItem={selectedItem}
                      disable={loading}
                      onChange={(value: any, item: any) => onChange(value, item)}
                    />
                    <Form.Group className="mb-2" controlId="checkbox">
                      <Form.Check
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e: any) => setRememberMe(!rememberMe)}
                        disabled={Util.isNullOrUndefinedOrEmpty(selectedItem.userName)}
                        tabIndex={3}
                        label="Remember me"
                      />
                    </Form.Group>
                    <Button className="w-100" variant="primary" type="submit">
                      {loading ? 'Logging In...' : 'Log In'}
                    </Button>
                  </>
                )}
  
                <div className="d-grid justify-content-end">
                  <Button
                    className="text-muted px-0"
                    variant="link"
                    onClick={handlePassword}
                  >
                    Forgot password?
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <div className='loginfooter'>
            <div className='container'>
              <div className='loginfooter-inner'>
                <div className='loginfooter-row'>
                  <div className='loginfooter-lang'>
                    <select>
                      <option>Language</option>
                      <option selected>English (US)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
      <ToastContainer />
    </>
  );
};

export default Login;
