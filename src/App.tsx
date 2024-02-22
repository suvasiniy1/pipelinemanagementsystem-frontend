import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SideBar } from './components/sidebar';
import { useLocation } from 'react-router-dom';
import { AppRouter } from './others/appRouter';
import Login from './components/login';

function App() {

  const location = useLocation();
  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !['/login', '/signup'].includes(pathname);
  };

  return (
    <>
      <div>
        {shouldShowSidebar() ? <SideBar /> : <Login/>}
      </div>
    </>

  );
}

export default App;
