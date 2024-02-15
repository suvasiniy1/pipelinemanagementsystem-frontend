import React, { useState } from 'react';
import './Login.css';
import mailIcon from '../images/mail-142.svg';
import passwordIcon from '../images/password-117.svg';


const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would handle the login logic, perhaps calling a .NET backend API
    // Here you would handle the login logic, perhaps calling a .NET backend API
    const loginSuccessful = await onLogin({ email, password }); // Replace with real API call
    if (loginSuccessful) {
      // Redirect to homepage if login is successful
      // This could be done with React Router's useHistory hook or by passing down the history prop
    }
    // Perform API call to backend for authentication
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Log in</h2>
        <div className="form-group">
  <div className="input-icon">
    <span className="icon-email"></span>
    <input
      type="email"
      name="email"
      placeholder="Email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
</div>
<div className="form-group">
  <div className="input-icon">
    <span className="icon-password"></span>
    <input
      type="password"
      name="password"
      placeholder="Password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
</div>
        <div className="form-group">
          <button type="submit" className="login-button">Log in</button>
        </div>
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" name="remember" /> Remember me
          </label>
          <a href="#" className="forgot-password">Forgot?</a>
        </div>
       
      </form>
    </div>
  );
};

export default Login;
