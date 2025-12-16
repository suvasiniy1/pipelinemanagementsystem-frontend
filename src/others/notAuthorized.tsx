import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const NotAuthorized = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuthContext();
  const { state } = useLocation() as { state?: { status?: number } };
  const [code, setCode] = useState(state?.status ?? 403);
  
  useEffect(() => {
    if (!userProfile) {
      setCode(401);
    }
  }, [userProfile]);

  const handleGo = () => {
    if (!userProfile) {
      navigate('/login', { replace: true });
      return;
    }
    navigate('/pipeline', { replace: true });
  };
  return (
    <div className="not-authorized">
      <h1>{code} - {code === 401 ? 'Unauthorized' : 'Forbidden'}</h1>
      <div className="message">
        <p>{code === 401 ? 'You need to sign in to view this page.' : 'You are not authorized to view this page.'}</p>
        <p>Please contact your administrator for more details.</p>
      </div>
      <button className="notAuthorizedBtn" onClick={handleGo}>
        {code === 401 ? 'Go to Login' : 'Go to Home'}
      </button>
    </div>
  );
};

export default NotAuthorized;
