namespace StepUpServer.Domains.Achievements;

public readonly record struct AchievementsProgressResponse(
    string Id,
    string UserId,
    AchievementDetail[] Achievements
);

public record struct AchievementDetail(
    string Name,
    UnitCategory UnitCategory,
    AchievementType Type,
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

public enum AchievementType
{
    OneOff = 0,
    Cumulative = 1,
}
