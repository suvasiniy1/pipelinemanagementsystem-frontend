import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { status?: number } };
  //const code = state?.status ?? 403; // optional: pass {state:{status:401}} when routing here
  const [code, setCode] = useState(state?.status ?? 403);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        setCode(res.status === 401 ? 401 : 403);
      } catch {
        setCode(401);
      }
    })();
  }, []);
const handleGo = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.status === 401 || !res.ok) {
        navigate('/login', { replace: true });
        return;
      }
      const me = await res.json();
      navigate(me?.role === 'Admin' ? '/admin' : '/pipeline', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
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
