import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { sendEmail } from "./emailService";
import { AuthProvider } from "./authProvider";

function EmailActivities() {
  const { instance, accounts } = useMsal();
  const [emailSent, setEmailSent] = useState(false);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSendEmail = async () => {
    try {
      const accessTokenResponse = await instance.acquireTokenSilent({
        scopes: ["Mail.Send"],
        account: accounts[0],
      });
      await sendEmail(accessTokenResponse.accessToken);
      setEmailSent(true);
    } catch (error) {
      console.error("Email sending failed", error);
    }
  };

  return (
    <div>
        {accounts.length === 0 ? (
          <button onClick={handleLogin}>Login with Microsoft</button>
        ) : (
          <div>
            <button onClick={handleSendEmail}>Send Email</button>
            {emailSent && <p>Email Sent!</p>}
          </div>
        )}
    </div>
  );
}

export default EmailActivities;
