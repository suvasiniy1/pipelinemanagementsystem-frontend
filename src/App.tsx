import "bootstrap/dist/css/bootstrap.min.css";
import moment from 'moment';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/login';
import { SideBar } from './components/sidebar';
import LocalStorageUtil from './others/LocalStorageUtil';
import Constants from './others/constants';

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
      {shouldShowSidebar() ? <SideBar /> : <Login/>}
    </>

  );
}

export default App;
