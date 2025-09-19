import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import { SideBar } from "./components/sidebar";
import LocalStorageUtil from "./others/LocalStorageUtil";
import Constants from "./others/constants";
import { Container, Spinner } from "react-bootstrap";
import { Content } from "rsuite";
import { HeaderComponent } from "./components/header/header";
import { AppRouter } from "./others/appRouter";
import NotAuthorized from "./others/notAuthorized";
import Util from "./others/util";
import ChangePassword from "./components/profiles/changePassword";
import { UserService } from "./services/UserService";
import { ErrorBoundary } from "react-error-boundary";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [navItemsLoaded, setNavItemsLoaded] = useState(false);
  const userService = new UserService(ErrorBoundary);
  const navigate = useNavigate();
  const location = useLocation();
  
  const clearLocalStorage = () => {
    LocalStorageUtil.removeItem(Constants.USER_LOGGED_IN);
    LocalStorageUtil.removeItem(Constants.ACCESS_TOKEN);
    LocalStorageUtil.removeItem(Constants.TOKEN_EXPIRATION_TIME);
  };
  
  // Setup axios interceptor for 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.alert('Session has expired. Please login again.');
          clearLocalStorage();
          window.location.href = window.config?.HomePage || '/login';
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, [clearLocalStorage]);
  
  // Additional global error handler
  useEffect(() => {
    const handleGlobalError = (event: any) => {
      if (event.reason?.response?.status === 401 || event.error?.response?.status === 401) {
        window.alert('Session has expired. Please login again.');
        clearLocalStorage();
        window.location.href = window.config?.HomePage || '/login';
      }
    };
    
    window.addEventListener('unhandledrejection', handleGlobalError);
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleGlobalError);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [clearLocalStorage]);
  
  useEffect(() => {
    const initializeApp = async () => {
      if (LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === "true") {
        try {
          const users = await userService.getUsers();
          LocalStorageUtil.setItem('USERS_DATA', JSON.stringify(users));
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      }
      setNavItemsLoaded(true);
    };
    
    initializeApp();
  }, []);
  const [collapsed, setCollapsed] = useState<any>(
    (LocalStorageUtil.getItem(Constants.ISSIDEBAR_EXPANDED) as any) === "false"
      ? false
      : true
  );

  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !["/login", "/signup"].includes(pathname);
  };

  const IsChangePassword = (): boolean => {
    return location.pathname === "/changePassword";
  };

  const IsConfirmEmail = (): boolean => {
    return location.pathname === "/confirm-email";
  };

  const IsNotAuthorized = (): boolean => {
    return !Util.isAuthorized(location.pathname.replace(/^\/+/, ""));
  };

  useEffect(() => {
    if (
      LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) != "true" &&
      !IsChangePassword()
    ) {
      clearLocalStorage();
      navigate("/login");
    }

    if (IsConfirmEmail()) {
      const queryString = location.search;
    navigate(`/confirm-email${queryString}`);
    }
  }, []);

  const checkSession = () => {
    const currentDateTime = moment().format("MM/DD/YYYY hh:mm:ss a");
    const tokenExpirationTime = LocalStorageUtil.getItem(
      Constants.TOKEN_EXPIRATION_TIME
    );

    if (
      tokenExpirationTime &&
      Date.parse(currentDateTime) > Date.parse(tokenExpirationTime)
    ) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    console.log("Session expired. Logging out...");

    // Clear session data
    clearLocalStorage();

    window.alert("Session has expired");

    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    // Listen to user activity
    const events = ["click", "keydown", "mousemove", "scroll"];

    const activityHandler = () => {
      checkSession();
    };

    events.forEach((event) => window.addEventListener(event, activityHandler));

    return () => {
      // Cleanup event listeners on unmount
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
    };
  }, []);

  useEffect(() => {
    LocalStorageUtil.setItem(Constants.ISSIDEBAR_EXPANDED, !collapsed as any);
  }, [collapsed]);

  return (
    <AuthProvider>
      {!navItemsLoaded ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : IsChangePassword() ? (
        <ChangePassword />
      ) : IsConfirmEmail() ? (
        <Content className="maincontentinner">
          <AppRouter />
        </Content>
      ) : shouldShowSidebar() ? (
        IsNotAuthorized() ? (
          <NotAuthorized />
        ) : (
          <>
            <div className="mainlayout">
              <SideBar collapsed={collapsed} />
              <div
                className="maincontent"
                style={{ maxWidth: collapsed ? "100%" : "90%" }}
              >
                <HeaderComponent
                  onExpandCollapseClick={(e: any) => setCollapsed(!collapsed)}
                  collapsed={collapsed}
                />
                <Content className="maincontentinner">
                  <AppRouter />
                </Content>
              </div>
            </div>
          </>
        )
      ) : (
        <Login />
      )}
    </AuthProvider>
  );
}

export default App;
