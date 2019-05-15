import {
  CognitoUserPool,
  ICognitoUserPoolData,
  CognitoUser
} from "amazon-cognito-identity-js";

export type RequestHeader = { [index: string]: string };

export const getUserPool: () => CognitoUserPool = () => {
  const poolData: ICognitoUserPoolData = {
    UserPoolId: "eu-west-2_6Mn0M2i9C",
    ClientId: "1jc3fojn08095rngppbj588709"
  };
  return new CognitoUserPool(poolData);
};

export const getCurrentUser: () => CognitoUser | null = () => {
  return getUserPool().getCurrentUser();
};

export const getAuthorisationHeaders: () => Promise<RequestHeader> = () => {
  return new Promise<RequestHeader>((resolve, reject) => {
    const user: CognitoUser | null = getCurrentUser();
    if (user !== null) {
      user.getSession(function(_: any, result: any) {
        if (result) {
          const Authorization = result.idToken.jwtToken;
          resolve({
            Authorization,
            "Content-Type": "application/json"
          });
        }
      });
    }
    reject({});
  });
};

export const getIdentityPoolId: () => string = () => {
  return "eu-west-2:4b26364a-3070-4f98-8e86-1e33a1b54d85";
};

export const getCognitoLoginId: () => string = () => {
  return "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_6Mn0M2i9C";
};
