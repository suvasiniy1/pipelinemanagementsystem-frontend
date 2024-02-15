import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentForm from './components/LoginPage';
import HomePage from './HomePage.js'; // Import your homepage component
import './App.css';

 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (credentials) => {
    // Perform the login logic, replace with actual validation
    const { email, password } = credentials;
    if (email === 'user@example.com' && password === 'password') { // Replace with real validation
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate replace to="/home" /> : <StudentForm onLogin={handleLogin} />} />
        <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
/*function App() {
  return (
    <div className="App">
      <h1>CRM</h1>
      <StudentForm/>
    </div>
    );
}

export default App;*/
