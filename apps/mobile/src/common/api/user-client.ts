import { ApiClient } from "./api-client";
import { ApiError, User } from "./api-definitions";

export class UserClient extends ApiClient {
  startSignUp = async (params: {
    email: string;
    username: string;
  }): Promise<{ error?: ApiError }> =>
    this.request("/users/signup/start", {
      method: "POST",
      body: JSON.stringify(params),
    });

  completeSignUp = async (params: {
    email: string;
    authToken: string;
  }): Promise<{
    data?: User;
    error?: ApiError;
  }> =>
    this.request<User>("/users/signup/complete", {
      method: "POST",
      body: JSON.stringify(params),
    });

  startSignIn = async (params: {
    email: string;
  }): Promise<{ error?: ApiError }> =>
    this.request("/users/signin/start", {
      method: "POST",
      body: JSON.stringify(params),
    });

  completeSignIn = async (params: {
    email: string;
    authToken: string;
  }): Promise<{
    data?: User;
    error?: ApiError;
  }> =>
    this.request<User>("/users/signin/complete", {
      method: "POST",
      body: JSON.stringify(params),
    });
}

export const userClient = new UserClient();
