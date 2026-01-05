import { ApiClient } from "./api-client";
import { Achievements } from "./api-definitions";

export class AchievementsClient extends ApiClient {
  getByUserId = async (userId: string) =>
    this.request<Achievements>(`/achievements/byUserId/${userId}`, {
      method: "GET",
    });
}

export const achievementsClient = new AchievementsClient();
