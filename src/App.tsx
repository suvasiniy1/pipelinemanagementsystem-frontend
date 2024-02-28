import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SideBar } from './components/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRouter } from './others/appRouter';
import Login from './components/login';
import { useEffect } from 'react';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !['/login', '/signup'].includes(pathname);
  };

  useEffect(()=>{
    if(localStorage.getItem("isUserLoggedIn")==="true"){
      navigate("/pipeline")
    }
    else{
      navigate("/login")
    }
  },[])

  return (
    <>
      <div>
        {shouldShowSidebar() ? <SideBar /> : <Login/>}
      </div>
    </>

  );
}

export default App;
