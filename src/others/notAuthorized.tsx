import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="not-authorized">
      <h1>403 - Forbidden</h1>
      <div className="message">
        <p>You are not authorized to view this page.</p>
        <p>Please contact your administrator for more details.</p>
      </div>
      <button className="notAuthorizedBtn" onClick={() => navigate('/pipeline')}>
        Go to Home
      </button>
    </div>
  );
};

export default NotAuthorized;
