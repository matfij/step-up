import { appConfig } from "./config";

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
