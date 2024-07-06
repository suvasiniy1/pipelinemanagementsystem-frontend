export const msalConfig = {
    auth: {
      clientId: '58f8d840-1215-4e4f-8901-da06f1dba5ac',//695b040b-dc37-4615-a5f1-6645bef0ca2e
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "Mail.Send", "Mail.Read"],
  };
  