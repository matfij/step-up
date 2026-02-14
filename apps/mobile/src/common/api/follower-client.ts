import { ApiClient } from "./api-client";
import { Follower } from "./api-definitions";

export class FollowerClient extends ApiClient {
  follow = async (followerId: string) =>
    this.request<Follower>(`/followers/follow/${followerId}`, {
      method: "POST",
    });

  unfollow = async (followerId: string) =>
    this.request<string>(`/followers/unfollow/${followerId}`, {
      method: "DELETE",
    });
}

export const followerClient = new FollowerClient();
