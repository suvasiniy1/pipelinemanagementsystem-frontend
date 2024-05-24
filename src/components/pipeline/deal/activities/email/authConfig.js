export const msalConfig = {
    auth: {
      clientId: '7f63b589-ac5d-428c-acbf-0660a5436924',
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
  };
  