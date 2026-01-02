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

export const isValidAuthToken = (authToken: string) => {
  return (
    !isNaN(Number(authToken)) &&
    authToken.length === appConfig.validation.authTokenLength
  );
};

export const isValidActivityName = (name: string) => {
  return (
    name.trim().length >= appConfig.validation.activityNameLengthMin &&
    name.trim().length <= appConfig.validation.activityNameLengthMax
  );
};

export const isValidActivityDescription = (description: string) => {
  return (
    description.trim().length <=
    appConfig.validation.activityDescriptionLengthMax
  );
};
