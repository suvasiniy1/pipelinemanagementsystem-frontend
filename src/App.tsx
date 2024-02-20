import './App.css';
import { Home } from './components/home';
import Login from './components/login';
import "bootstrap/dist/css/bootstrap.min.css";
import { AppRouter } from './others/appRouter';

function App() {
  return (
    <>
      <AppRouter />
    </>

  );
}

export default App;
