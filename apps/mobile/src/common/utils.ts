import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const getAsyncStorageItem = async <T>(
  key: keyof typeof appConfig.storageKeys
) => {
  const data = await AsyncStorage.getItem(appConfig.storageKeys[key]);
  if (data === null || data === undefined) {
    return undefined;
  }
  return JSON.parse(data) as T;
};

export const setAsyncStorageItem = async (
  key: keyof typeof appConfig.storageKeys,
  item: unknown
) => {
  await AsyncStorage.setItem(appConfig.storageKeys[key], JSON.stringify(item));
};
