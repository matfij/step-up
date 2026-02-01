import { ApiClient } from "./api-client";
import { Progress } from "./api-definitions";

export class ProgressClient extends ApiClient {
  getByUserId = async (userId: string) =>
    this.request<Progress>(`/progress/byUserId/${userId}`, { method: "GET" });

  getBestDuration = async () =>
    this.request<Progress[]>("/progress/bestDuration", { method: "GET" });

  getBestDistance = async () =>
    this.request<Progress[]>("/progress/bestDistance", { method: "GET" });

  getBestMonthlyDuration = async () =>
    this.request<Progress[]>("/progress/bestMonthlyDuration", { method: "GET" });

  getBestMonthlyDistance = async () =>
    this.request<Progress[]>("/progress/bestMonthlyDistance", { method: "GET" });
}

export const progressClient = new ProgressClient();
