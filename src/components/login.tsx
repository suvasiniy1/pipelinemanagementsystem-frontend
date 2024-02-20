import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import BackgroundImage from "../resources/images/background.png";
import Logo from "../resources/images/logo.png";
import TextBox from "../elements/TextBox";
import { ElementType, IControl } from "../models/iControl";
import GenerateElements from "../common/generateElements";
import Util from "../others/util";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";

export class UserCredentails {
  public userName!: string;
  public password!: string;
  public domain!: string;
  public region!: string;

}

const Login = () => {

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(new UserCredentails());
  const [disablePassword, setDisablePassword] = useState<boolean>(true);
  const navigate = useNavigate();

  const [controlsList, setControlsList] = useState<Array<IControl>>([
    { "key": "User Name", "value": "userName", "isRequired": true, "tabIndex":1, "isFocus":true, "placeHolder": "User Name", "isControlInNewLine": true, "elementSize": 12 },
    { "key": "Password", "value": "password", "disabled": true, "tabIndex":2, "placeHolder": "Password", "isControlInNewLine": true, "elementSize": 12 },
  ]);

  const validationsSchema = Yup.object().shape({
    ...Util.buildValidations(controlsList)
  });

  const formOptions = { resolver: yupResolver(validationsSchema) };
  const methods = useForm(formOptions);
  const { handleSubmit, getValues, setValue } = methods;

  const onSubmitClick = async (event: any) => {
    setLoading(true);
    await delay(500);
    console.log(`Username :${selectedItem.userName}, Password :${selectedItem.password}`);
    if (selectedItem.userName.toLocaleLowerCase() !== "developer") {
      setShow(true);
    }
    else{
      setLoading(false);
      localStorage.setItem("isUserLoggedIn", "true");
      navigate("/");
    }
  
  };

  const handlePassword = () => { };

  function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const onChange = (value: any, item: any) => {
    
    let obj = { ...selectedItem };
    if(item.value=="userName") obj.userName = value;
    if(item.value=="password") obj.password = value;

    setSelectedItem(obj);
    setDisablePassword(Util.isNullOrUndefinedOrEmpty(obj.userName));
    let cntrlList = [...controlsList];
    cntrlList[1].disabled = Util.isNullOrUndefinedOrEmpty(obj.userName);
    cntrlList[1].isRequired = obj.userName!=="developer";
    cntrlList[1].isFocus = !Util.isNullOrUndefinedOrEmpty(obj.userName);
    setControlsList([...cntrlList]);
  }

  useEffect(()=>{
    localStorage.setItem("isUserLoggedIn", "false");
  },[])

  return (
    <FormProvider {...methods}>
      <div
        className="sign-in__wrapper"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        {/* Overlay */}
        <div className="sign-in__backdrop"></div>
        {/* Form */}
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit(onSubmitClick)}>
          {/* Header */}
          <img
            className="img-thumbnail mx-auto d-block mb-2"
            src={Logo}
            alt="logo"
          />
          <div className="h4 mb-2 text-center">Sign In</div>
          {/* ALert */}
          {show ? (
            <Alert
              className="mb-2"
              variant="danger"
              onClose={() => setShow(false)}
              dismissible
            >
              Incorrect username or password.
            </Alert>
          ) : (
            <div />
          )}
          {
            <GenerateElements controlsList={controlsList}
                              selectedItem={selectedItem}
                              onChange={(value: any, item: any) => onChange(value, item)}
            />
          }
          <Form.Group className="mb-2" controlId="checkbox">
            <Form.Check type="checkbox" disabled={Util.isNullOrUndefinedOrEmpty(selectedItem.userName)} tabIndex={3} label="Remember me" />
          </Form.Group>
          {!loading ? (
            <Button className="w-100" variant="primary" type="submit">
              Log In
            </Button>
          ) : (
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
        </Form>
        {/* Footer */}
        {/* <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div> */}
      </div>
    </FormProvider>

  );
};

export default Login;
