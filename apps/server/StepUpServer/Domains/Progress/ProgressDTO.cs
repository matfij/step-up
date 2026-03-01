namespace StepUpServer.Domains.Progress;

public record struct ProgressResponse(
    string Id,
    string UserId,
    string Username,
    string? AvatarUri,
    uint Level,
    ulong Experience,
    ulong CurrentStreak,
    ulong BestStreak,
    ulong TotalDuration,
    ulong TotalDistance,
    ulong TotalActivities,
    ulong MonthlyDuration,
    ulong MonthlyDistance
);
