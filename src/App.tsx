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
    let isSessionExpired = moment(new Date()).format("DD/MM/YYYY hh:mm:ss a") > (LocalStorageUtil.getItem(Constants.TOKEN_EXPIRATION_TIME) as any);
    if (isSessionExpired) {
      window.alert("Session has expired");
      navigate("/login");
      return;
    }
    if (LocalStorageUtil.getItem(Constants.USER_LOGGED_IN) === "true") {
      navigate("/pipeline")
    }
    else {
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
