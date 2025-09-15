import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { status?: number } };
  const code = state?.status ?? 403; // optional: pass {state:{status:401}} when routing here
 const handleGo = async () => {
    try {
      // Ask the server who we are (don’t trust localStorage)
      const res = await fetch("/api/me", { credentials: "include" });

      // Not logged in -> go to login
      if (res.status === 401 || !res.ok) {
        navigate("/login", { replace: true });
        return;
      }

      // Logged in -> route by true server role
      const me = await res.json(); // e.g., { role: "Admin" | "Sales" | ... }
      const home = me?.role === "Admin" ? "/admin" : "/pipeline";
      navigate(home, { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };
  return (
    <div className="not-authorized">
      <h1>{code} - {code === 401 ? "Unauthorized" : "Forbidden"}</h1>
      <div className="message">
        <p>
          {code === 401
            ? "You need to sign in to view this page."
            : "You are not authorized to view this page."}
        </p>
        <p>Please contact your administrator for more details.</p>
      </div>
      <button className="notAuthorizedBtn" onClick={handleGo}>
        {code === 401 ? "Go to Login" : "Go to Home"}
      </button>
    </div>
  );
};

export default NotAuthorized;
