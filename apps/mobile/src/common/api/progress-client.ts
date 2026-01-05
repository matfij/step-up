import { ApiClient } from "./api-client";
import { Progress } from "./api-definitions";

export class ProgressClient extends ApiClient {
  getByUserId = async (userId: string) =>
    this.request<Progress>(`/progress/byUserId/${userId}`, { method: "GET" });
}

export const progressClient = new ProgressClient();
