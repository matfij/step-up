import { ApiClient } from "./api-client";
import { Progress } from "./api-definitions";

export class ProgressClient extends ApiClient {
  getByUser = async () =>
    this.request<Progress>("/progress", { method: "GET" });
}

export const progressClient = new ProgressClient();
