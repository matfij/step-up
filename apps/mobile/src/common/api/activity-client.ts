import { ApiClient } from "./api-client";
import { Activity } from "./api-definitions";

export class ActivityClient extends ApiClient {
  create = async (params: Omit<Activity, "id" | "userId">) =>
    this.request<Activity>("/activities", {
      method: "POST",
      body: JSON.stringify(params),
    });

  getById = async (id: string) =>
    this.request<Activity>(`/activities/${id}`, { method: "GET" });

  getByUserId = async (params: {
    userId: string;
    skip: number;
    take: number;
  }) =>
    this.request<Activity[]>(
      `/activitiesByUserId/${params.userId}?skip=${params.skip}&take=${params.take}`,
      { method: "GET" }
    );

  edit = (params: { id: string; name: string; description?: string }) =>
    this.request<Activity>("/activities", {
      method: "PUT",
      body: JSON.stringify(params),
    });
}

export const activityClient = new ActivityClient();
