namespace StepUpServer.Domains.Achievements;

public readonly record struct AchievementsProgress(
    string Id,
    string UserId,
    AchievementProgress[] Achievements
);

public record struct AchievementProgress(
    string Name,
    UnitCategory UnitCategory,
    AchievementTier Tier,
    ulong Progress,
    ulong CurrentTierProgress,
    ulong NextTierProgress,
    ulong AchievedAt
);

public enum UnitCategory
{
    Count = 0,
    Time = 1,
    Distance = 2,
    Speed = 3,
}
