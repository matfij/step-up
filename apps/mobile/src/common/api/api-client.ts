import Constants from "expo-constants";
import { ApiError } from "./api-definitions";
import { useUserStore } from "../state/user-store";

export abstract class ApiClient {
  private baseUrl = getApiUrl();

  protected request = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> => {
    try {
      const token = useUserStore.getState().user?.apiToken;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
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
      console.log("api error", endpoint, error);
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

const getApiUrl = () => {
  if (__DEV__) {
    return Constants.platform?.android
      ? "http://10.0.2.2:8080"
      : "http://127.0.0.1:8080";
  }
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (!apiUrl) {
    throw new Error("Provide apiUrl in app.json extra config.");
  }
  return apiUrl;
};
