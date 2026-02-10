using StepUpServer.Common;
using StepUpServer.Domains.User;

namespace StepUpServer.Domains.Follower;

public static class FollowerEndpoints
{
    public static void MapFollowerEndpoints(this WebApplication app)
    {
        app.MapPost(
                "/followers/follow/{id}",
                async (string id, HttpContext context, IFollowerService followerService) =>
                {
                    var userId = context.GetUserId();
                    var follower = await followerService.Create(userId, id);
                    return Results.Ok(
                        new
                        {
                            follower.Id,
                            follower.FollowerId,
                            follower.FollowerUsername,
                            follower.FollowingId,
                            follower.FollowingUsername,
                        }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/followers/followers/{id}",
                async (string id, HttpContext context, IFollowerService followerService) =>
                {
                    var followers = await followerService.GetFollowers(id);
                    return Results.Ok(
                        followers.Select(
                            follower =>
                                new
                                {
                                    follower.Id,
                                    follower.FollowerId,
                                    follower.FollowerUsername,
                                    follower.FollowingId,
                                    follower.FollowingUsername,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/followers/following/{id}",
                async (string id, HttpContext context, IFollowerService followerService) =>
                {
                    var following = await followerService.GetFollowing(id);
                    return Results.Ok(
                        following.Select(
                            follower =>
                                new
                                {
                                    follower.Id,
                                    follower.FollowerId,
                                    follower.FollowerUsername,
                                    follower.FollowingId,
                                    follower.FollowingUsername,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapDelete(
                "/followers/unfollow/{id}",
                async (string id, HttpContext context, IFollowerService followerService) =>
                {
                    var userId = context.GetUserId();
                    await followerService.Delete(userId, id);
                    return Results.Ok();
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
