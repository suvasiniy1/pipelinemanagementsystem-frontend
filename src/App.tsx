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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<any>(LocalStorageUtil.getItem(Constants.ISSIDEBAR_EXPANDED) as any ==="false" ?? false);
  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !["/login", "/signup"].includes(pathname);
  };

  useEffect(() => {
    let currentDateTime = moment(new Date()).format("MM/DD/YYYY hh:mm:ss a");
    let tokenExpirationTime = LocalStorageUtil.getItem(
      Constants.TOKEN_EXPIRATION_TIME
    ) as any;
    let isSessionExpired =
      Date.parse(currentDateTime) > Date.parse(tokenExpirationTime);
    if (isSessionExpired) {
      console.log(
        "Session has expired as token is expired... " + tokenExpirationTime
      );
      window.alert("Session has expired");
      navigate("/login");
      return;
    }
    if (LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) != "true") {
      navigate("/login");
    }
  }, []);

  useEffect(()=>{
    LocalStorageUtil.setItem(
      Constants.ISSIDEBAR_EXPANDED,
      !collapsed as any
    );
  },[collapsed])

  return (
    <>
      {shouldShowSidebar() ? (
        <>
          <div className="mainlayout">
            <SideBar collapsed={collapsed} />
            <div className="maincontent" style={{ maxWidth: collapsed ? "100%" : '90%' }}>
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
