import Constants from "expo-constants";
import { ApiError } from "./api-definitions";
import { useUserStore } from "../state/user-store";
import { delay } from "../utils";

export abstract class ApiClient {
  private baseUrl = getApiUrl();
  private readonly timeout = 15_000;
  private readonly retryCount = 1;
  private readonly retryDelay = 1500;

  protected request = async <T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<{ data?: T; error?: ApiError }> => {
    let apiError = { name: "", message: "", key: "" };

    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const token = useUserStore.getState().user?.apiToken;

        const headers: HeadersInit = {
          ...(token && { Authorization: token }),
          ...options?.headers,
        };

        const abortController = new AbortController();
        const timeoutId = setTimeout(
          () => abortController.abort(),
          this.timeout,
        );

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          return { error: errorData.error };
        }

        const data = await this.safeParse(response);
        return { data };
      } catch (error) {
        apiError = {
          name: "Unknown Error",
          key: "errors.unknown",
          message:
            error instanceof Error
              ? error.message
              : "Failed to connect to server",
        };
        if (attempt < this.retryCount) {
          await delay(this.retryDelay);
        }
      }
    }

    return { error: apiError };
  };

  private safeParse = async (response: Response) => {
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    return JSON.parse(text);
  };
}

export const getApiUrl = () => {
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
