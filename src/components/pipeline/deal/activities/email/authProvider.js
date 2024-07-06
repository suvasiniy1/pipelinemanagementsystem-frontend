import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = await new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
