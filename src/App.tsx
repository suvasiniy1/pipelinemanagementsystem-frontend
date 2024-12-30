import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import { SideBar } from "./components/sidebar";
import LocalStorageUtil from "./others/LocalStorageUtil";
import Constants from "./others/constants";
import { Container } from "react-bootstrap";
import { Content } from "rsuite";
import { HeaderComponent } from "./components/header/header";
import { AppRouter } from "./others/appRouter";
import NotAuthorized from "./others/notAuthorized";
import Util from "./others/util";
import ChangePassword from "./components/profiles/changePassword";
import ConfirmEmail from "./components/ConfirmEmail";

function App() {
  
  Util.loadNavItemsForUser(LocalStorageUtil.getItem(Constants.USER_Role) as any);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<any>(
    (LocalStorageUtil.getItem(Constants.ISSIDEBAR_EXPANDED) as any) ===
      "false" ? false : true
  );
  

  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !["/login", "/signup"].includes(pathname);
  };

  const IsChangePassword= (): boolean => {
    
    return location.pathname==="/changePassword";
}
const IsConfirmEmail= (): boolean => {
    
  return location.pathname==="/confirm-email";
}


  const IsNotAuthorized = (): boolean => {
    return !Util.isAuthorized(location.pathname.replace(/^\/+/, ''));
}

  useEffect(() => {
    let currentDateTime = moment(new Date()).format("MM/DD/YYYY hh:mm:ss a");
    let tokenExpirationTime = LocalStorageUtil.getItem(
      Constants.TOKEN_EXPIRATION_TIME
    ) as any;
    let isSessionExpired =
      Date.parse(currentDateTime) > Date.parse(tokenExpirationTime);
    if (isSessionExpired && !IsChangePassword() && !IsConfirmEmail()) {
      console.log(
        "Session has expired as token is expired... " + tokenExpirationTime
      );
      window.alert("Session has expired");
      navigate("/login");
      return;
    }
    if (LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) != "true" && !IsChangePassword() && !IsConfirmEmail()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    LocalStorageUtil.setItem(Constants.ISSIDEBAR_EXPANDED, !collapsed as any);
  }, [collapsed]);

  return (
    <>
      {IsConfirmEmail()? <ConfirmEmail/> : IsChangePassword()? <ChangePassword/> : shouldShowSidebar() ? IsNotAuthorized()? <NotAuthorized/> : (
        <>
          <div className="mainlayout">
            <SideBar collapsed={collapsed} />
            <div
              className="maincontent"
              style={{ maxWidth: collapsed ? "100%" : "90%" }}
            >
              <HeaderComponent
                onExpandCollapseClick={(e: any) => setCollapsed(!collapsed)}
              />
              <Content className="maincontentinner">
                <AppRouter />
              </Content>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;




