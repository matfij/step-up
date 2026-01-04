using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Achievements;

public class Achievements
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public AchievementTier Traveler { get; set; } = AchievementTier.None; // based on total distance
    public AchievementTier Enduring { get; set; } = AchievementTier.None; // based on total duration
    public AchievementTier Swift { get; set; } = AchievementTier.None; // based on average speed on minimum 5000m distance
    public AchievementTier Consistent { get; set; } = AchievementTier.None; // based on current streak
    public AchievementTier Cumulative { get; set; } = AchievementTier.None; // based on total activities

    public bool Marathonner { get; set; } = false; // based on single activity distance

}

public enum AchievementTier
{
    None = 0,
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
