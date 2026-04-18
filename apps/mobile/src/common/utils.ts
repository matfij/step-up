import AsyncStorage from "@react-native-async-storage/async-storage";
import { appConfig, getApiUrl } from "./config";
import { logClient } from "./api/log-client";
import { LogType } from "./api/api-definitions";

export type Argument<T extends (...args: any) => any> = Parameters<T>[number];

export const noOp = () => {};

export const getAsyncStorageItem = async <T>(
  key: keyof typeof appConfig.storageKeys,
) => {
  try {
    const data = await AsyncStorage.getItem(appConfig.storageKeys[key]);
    if (data == null) {
      return undefined;
    }
    return JSON.parse(data) as T;
  } catch {
    return undefined;
  }
};

export const setAsyncStorageItem = async (
  key: keyof typeof appConfig.storageKeys,
  item: unknown,
) => {
  await AsyncStorage.setItem(appConfig.storageKeys[key], JSON.stringify(item));
};

export const clearAsyncStorage = async () => {
  await AsyncStorage.multiRemove([...Object.values(appConfig.storageKeys)]);
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

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value);
};

export const trimStack = (stack: string | null | undefined, maxLines = 5) => {
  if (!stack) {
    return stack;
  }
  return stack.split("\n").slice(0, maxLines).join("\n");
};

export const handleBackgroundError = (error: unknown, context?: string) => {
  try {
    const err = error instanceof Error ? error : new Error(String(error));

    const details = JSON.stringify({
      name: err.name,
      message: err.message,
      stack: trimStack(err.stack),
      context,
    });

    void logClient.log({
      type: LogType.Error,
      details,
    });
  } catch {}
};
