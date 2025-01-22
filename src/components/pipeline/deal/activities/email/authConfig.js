export const msalConfig = {
    auth: {
      clientId: window.config.ClientId,//695b040b-dc37-4615-a5f1-6645bef0ca2e
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: window.config.RedirectUri,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "Mail.Send", "Mail.Read", 
      "Mail.ReadWrite.Shared" , "Mail.ReadWrite", "Tasks.ReadWrite", 'Calendars.ReadWrite.Shared'],
  };
  