import AsyncStorage from "@react-native-async-storage/async-storage";
import { appConfig, getApiUrl } from "./config";

export type Argument<T extends (...args: any) => any> = Parameters<T>[number];

export const noOp = () => {};

export const getAsyncStorageItem = async <T>(
  key: keyof typeof appConfig.storageKeys,
  defaultValue?: T,
) => {
  const data = await AsyncStorage.getItem(appConfig.storageKeys[key]);
  if (data === null || data === undefined && defaultValue) {
    return defaultValue as T;
  }
  return JSON.parse(data) as T;
};

export const setAsyncStorageItem = async (
  key: keyof typeof appConfig.storageKeys,
  item: unknown,
) => {
  await AsyncStorage.setItem(appConfig.storageKeys[key], JSON.stringify(item));
};

export const withAlpha = (hexColor: string, alpha: number) => {
  const hex = hexColor.replace("#", "");
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${hex}${alphaHex}`;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getAvatarUri = (baseUri: string) => `${getApiUrl()}${baseUri}`;

export const generateRandomString = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const result = [];
  const charsLength = chars.length;
  for (let i = 0; i < length; i += 1) {
    result.push(chars[Math.floor(Math.random() * charsLength)]);
  }
  return result.join("");
};
