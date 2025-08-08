import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./components/pipeline/deal/activities/email/authProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}


root.render(
  <AuthProvider>
    <BrowserRouter basename={window.config.HomePage}>
      <App />
    </BrowserRouter>
  </AuthProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
