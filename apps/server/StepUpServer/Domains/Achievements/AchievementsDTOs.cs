namespace StepUpServer.Domains.Achievements;

public readonly record struct AchievementsProgress(
    string Id,
    string UserId,
    AchievementProgress TotalDistance,
    AchievementProgress TotalDuration,
    AchievementProgress TotalActivities,
    AchievementProgress MaxCurrentStreak,
    AchievementProgress MaxActivitySpeed,
    AchievementProgress MaxActivityDistance,
    AchievementProgress MaxActivityDuration,
    AchievementProgress Greenhorn,
    AchievementProgress Marathoner
);

public record struct AchievementProgress(
    AchievementTier Tier,
    ulong Progress,
    ulong PreviousTierProgress,
    ulong NextTierProgress,
    ulong AchievedAt
);

