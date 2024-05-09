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
  public email: string = "test";
  public userId: number = 0;

  constructor(userName: string = null as any,
    passwordHash: string = null as any,
    email: string = "test",
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
  const [selectedItem, setSelectedItem] = useState(new UserCredentails(LocalStorageUtil.getItem(Constants.REMEMBER_ME) === "true" ? LocalStorageUtil.getItem(Constants.User_Name) as any ?? null : null));
  const [disablePassword, setDisablePassword] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState(false);
  const loginSvc = new LoginService(ErrorBoundary);
  const navigate = useNavigate();

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
    setIsIncorrectCredentails(null);
    await delay(1000);
    console.log(`Username :${obj.userName}, Password :${obj.passwordHash}`);

    if (rememberMe) {
      LocalStorageUtil.setItem(Constants.REMEMBER_ME, "true");
      LocalStorageUtil.setItem(Constants.User_Name, selectedItem.userName);
    }
    else {
      LocalStorageUtil.removeItem(Constants.REMEMBER_ME);
      LocalStorageUtil.removeItem(Constants.User_Name);
    }

    if (obj.userName.toLocaleLowerCase() !== "developer") {
      if(IsMockService()){
        LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
        navigate("/pipeline");
      }
      else{
        loginSvc.login(obj).then((res: UserProfile) => {
          setLoading(false);
          
          if (res && res?.token) {
            LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
            LocalStorageUtil.setItem(Constants.ACCESS_TOKEN, res?.token);
            LocalStorageUtil.setItem(Constants.User_Name, res?.user);
            LocalStorageUtil.setItem(Constants.TOKEN_EXPIRATION_TIME, Util.convertTZ(res?.expires));
            LocalStorageUtil.setItemObject(Constants.USER_PROFILE, res as any);
            navigate("/pipeline");
  
          }
          else {
            setIsIncorrectCredentails(res);
          }
        }).catch(err => {
          setLoading(false);
          toast.error(err);
        })
      }

    }
    else {
      setLoading(false);
      LocalStorageUtil.setItem(Constants.USER_LOGGED_IN, "true");
      navigate("/pipeline");
    }

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
              {/* Overlay */}
              <div className="sign-in__backdrop"></div>
              <div className='logheader'>
                  {<img className='lohheaderlogo' src={jpg} />}
              </div>
              {/* Form */}
              <Form className="shadow p-4 bg-white rounded loginformblock" onSubmit={handleSubmit(onSubmitClick)}>
                {/* Header */}
                <div className='logformhead'>
                  <div className='logformheadimg'>
                    <img className="img-thumbnail" src={Logo} alt="logo" />
                  </div>
                  <div className="h4">Sign In</div>
                </div>
                <div className='logformsubtext p-2 text-center'>Please log in to continue.</div>
                
                
                <div style={{ textAlign: "center" }}>
                  <span className="text-danger" hidden={!isIncorrectCredentails}>{isIncorrectCredentails}</span>
                  <div hidden={!loading}>
                    <Spinner />
                  </div>
                
                </div>
                {
                  <GenerateElements controlsList={controlsList}
                                    selectedItem={selectedItem}
                                    disable={loading}
                                    onChange={(value: any, item: any) => onChange(value, item)}
                  />
                }
                <Form.Group className="mb-2" controlId="checkbox">
                  <Form.Check type="checkbox" checked={rememberMe} onChange={(e: any) => setRememberMe(!rememberMe)} disabled={Util.isNullOrUndefinedOrEmpty(selectedItem.userName)} tabIndex={3} label="Remember me" />
                </Form.Group>
                {!loading ? (
                  <Button className="w-100" variant="primary" type="submit">
                    Log In
                  </Button>
                ) : loading && (
                  <Button className="w-100" variant="primary" type="submit" disabled>
                    Logging In...
                  </Button>
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
                <div className='oraccessquickly text-center mt-3 mb-3'>
                  <span>or access quickly</span>
                </div>
                <div className='oraccessquicklybtn'>
                  <a className='btn' href='#'>Google</a>
                  <a className='btn' href='#'>SSO</a>
                </div>

              </Form>
              {/* Footer */}
              {/* <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
            Made by Hendrik C | &copy;2022
          </div> */}
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
                  <div className='loginfooter-social'>
                    {/* <ul className='socialmedia'>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faFacebook} /></a></li>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faXTwitter} /></a></li>
                      <li><a href='#' target='_blank'><FontAwesomeIcon icon={faLinkedin} /></a></li>
                    </ul> */}
                  </div>
                </div>
                <div className='loginfooter-btmlink'>
                  <ul className='loginfooter-link'>
                    <li>@ 2024 Pipedrive</li>
                    <li><a href='#'>Terms of Service</a></li>
                    <li><a href='#'>Privacy Policy</a></li>
                  </ul>
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
