import { ApiClient } from "./api-client";
import { Follower } from "./api-definitions";

export class FollowerClient extends ApiClient {
  follow = async (followerId: string) =>
    this.request<Follower>(`/followers/follow/${followerId}`, {
      method: "POST",
    });

  getFollowers = async (userId: string) =>
    this.request<Follower[]>(`/followers/followers/${userId}`, {
      method: "GET",
    });

  getFollowing = async (userId: string) =>
    this.request<Follower[]>(`/followers/following/${userId}`, {
      method: "GET",
    });

  unfollow = async (followerId: string) =>
    this.request<string>(`/followers/unfollow/${followerId}`, {
      method: "DELETE",
    });
}

export const followerClient = new FollowerClient();
