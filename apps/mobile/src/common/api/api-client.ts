import AsyncStorage from "@react-native-async-storage/async-storage";
import { appConfig } from "../config";
import { ApiError } from "./api-definitions";

export abstract class ApiClient {
  private baseUrl = "http://10.0.2.2:8080";
  private token?: string;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    this.token =
      (await AsyncStorage.getItem(appConfig.storageKeys.apiToken)) ?? undefined;
  }

  setToken = async (token: string) => {
    this.token = token;
    await AsyncStorage.setItem(appConfig.storageKeys.apiToken, token);
  };

  clearToken = async () => {
    this.token = undefined;
    await AsyncStorage.removeItem(appConfig.storageKeys.apiToken);
  };

  protected request = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: this.token }),
        ...options?.headers,
      };
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error };
      }
      const data = await this.safeParse(response);
      return { data };
    } catch (error) {
      return {
        error: {
          name: "Unknown Error",
          key: "errors.unknown",
          message:
            error instanceof Error
              ? error.message
              : "Failed to connect to server",
        },
      };
    }
  };

  private safeParse = async (response: Response) => {
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    return JSON.parse(text);
  };
}
