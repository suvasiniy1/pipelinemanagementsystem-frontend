import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { isUserLoggedIn } from './others/authUtil';
import { HashRouter as Router, Route, BrowserRouter } from "react-router-dom";
import Login from './components/login';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
<BrowserRouter basename='PLMSUI'>
    <App/>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
