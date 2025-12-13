import { appConfig } from "./config";

export type Argument<T extends (...args: any) => any> = Parameters<T>[number];

export const isValidEmail = (email: string) => {
  if (!email) {
    return false;
  }
  return appConfig.validation.emailPattern.test(email.trim());
};

export const isValidUsername = (username: string) => {
  return (
    username.trim().length >= appConfig.validation.usernameLengthMin &&
    username.trim().length <= appConfig.validation.usernameLengthMax
  );
};

export const isValidAuthToken = (authToken: string) => {
  return (
    !isNaN(Number(authToken)) &&
    authToken.length === appConfig.validation.authTokenLength
  );
};
