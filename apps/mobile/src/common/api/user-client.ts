import { ApiClient } from "./api-client";
import { ApiError } from "./api-definitions";

export class UserClient extends ApiClient {
  startSignUp = async (params: {
    email: string;
    username: string;
  }): Promise<{ error?: ApiError }> => {
    return this.request("/users/signup/start", {
      method: "POST",
      body: JSON.stringify(params),
    });
  };

  completeSignUp = async (params: {
    email: string;
    authToken: string;
  }): Promise<{
    data?: {
      id: string;
      email: string;
      username: string;
      apiToken: string;
    };
    error?: ApiError;
  }> => {
    const result = await this.request<{
      id: string;
      email: string;
      username: string;
      apiToken: string;
    }>("/users/signup/complete", {
      method: "POST",
      body: JSON.stringify(params),
    });

    if (result.data?.apiToken) {
      await this.setToken(result.data.apiToken);
    }

    return result;
  };
}

export const userClient = new UserClient();
