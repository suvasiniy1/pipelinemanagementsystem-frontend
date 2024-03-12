import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SideBar } from './components/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRouter } from './others/appRouter';
import Login from './components/login';
import { useEffect } from 'react';
import LocalStorageUtil from './others/LocalStorageUtil';
import Constants from './others/constants';
import moment from 'moment';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !['/login', '/signup'].includes(pathname);
  };

  useEffect(() => {
    
    let currentDateTime = moment(new Date()).format("MM/DD/YYYY hh:mm:ss a");
    let tokenExpirationTime = (LocalStorageUtil.getItem(Constants.TOKEN_EXPIRATION_TIME) as any);
    let isSessionExpired = Date.parse(currentDateTime) > Date.parse(tokenExpirationTime);
    if (isSessionExpired) {
      console.log("Session has expired as token is expired... " + tokenExpirationTime);
      window.alert("Session has expired");
      navigate("/login");
      return;
    }
    if (LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) != "true") {
      navigate("/login")
    }
  }, [])

  return (
    <>
      <div>
        {shouldShowSidebar() ? <SideBar /> : <Login/>}
      </div>
    </>

  );
}

export default App;
