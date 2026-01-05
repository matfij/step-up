using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Achievements;

public class Achievements
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public AchievementDetails TotalDistance { get; set; } = new(); // based on total distance
    public AchievementDetails TotalDuration { get; set; } = new(); // based on total duration
    public AchievementDetails TotalActivities { get; set; } = new(); // based on total activities
    public AchievementDetails MaxCurrentStreak { get; set; } = new(); // based on current streak
    public AchievementDetails MaxActivitySpeed { get; set; } = new(); // based on average speed on minimum 5000m distance
    public AchievementDetails MaxActivityDistance { get; set; } = new(); // based on single activity distance

    public AchievementDetails Greenhorn { get; set; } = new(); // completing first activity
    public AchievementDetails Marathoner { get; set; } = new(); // based on single activity distance
}

public class AchievementDetails
{
    public AchievementTier Tier { get; set; } = AchievementTier.None;
    public ulong Progress { get; set; } = 0;
    public ulong AchievedAt { get; set; } = 0;
}

public enum AchievementTier
{
    None = 0,
    Achieved = 1,
    BronzeI = 10,
    BronzeII = 11,
    BronzeIII = 12,
    SilverI = 20,
    SilverII = 21,
    SilverIII = 22,
    GoldI = 30,
    GoldII = 31,
    GoldIII = 32,
    RubyI = 40,
    RubyII = 41,
    RubyIII = 42,
    MasterI = 50,
    MasterII = 51,
    MasterIII = 52,
}
