namespace StepUpServer.Domains.Follower;

public record struct FollowerResponse(
    string Id,
    string FollowerId,
    string FollowerUsername,
    string FollowingId,
    string FollowingUsername
);
