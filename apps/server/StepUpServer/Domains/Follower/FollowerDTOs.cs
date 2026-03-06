namespace StepUpServer.Domains.Follower;

public record struct FollowerResponse(
    string Id,
    string FollowerId,
    string FollowerUsername,
    string? FollowerAvatarUri,
    string FollowingId,
    string FollowingUsername,
    string? FollowingAvatarUri
);
