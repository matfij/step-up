namespace StepUpServer.Domains.Achievements;

public static class AchievementsData
{
    public static readonly Dictionary<AchievementTier, ulong> TravelerThresholds = new()
    {
        { AchievementTier.BronzeI, 10_000 },
        { AchievementTier.BronzeII, 50_000 },
        { AchievementTier.BronzeIII, 100_000 },
        { AchievementTier.SilverI, 250_000 },
        { AchievementTier.SilverII, 500_000 },
        { AchievementTier.SilverIII, 1_000_000 },
        { AchievementTier.GoldI, 2_500_000 },
        { AchievementTier.GoldII, 5_000_000 },
        { AchievementTier.GoldIII, 10_000_000 },
        { AchievementTier.RubyI, 25_000_000 },
        { AchievementTier.RubyII, 50_000_000 },
        { AchievementTier.RubyIII, 100_000_000 },
        { AchievementTier.MasterI, 250_000_000 },
        { AchievementTier.MasterII, 500_000_0000 },
        { AchievementTier.MasterIII, 1_000_000_000 },
    };

    public static readonly Dictionary<AchievementTier, ulong> EnduringThresholds = new()
    {
        { AchievementTier.BronzeI, 3_600_000 },
        { AchievementTier.BronzeII, 18_000_000 },
        { AchievementTier.BronzeIII, 36_000_000 },
        { AchievementTier.SilverI, 90_000_000 },
        { AchievementTier.SilverII, 180_000_000 },
        { AchievementTier.SilverIII, 360_000_000 },
        { AchievementTier.GoldI, 900_000_000 },
        { AchievementTier.GoldII, 1_800_000_000 },
        { AchievementTier.GoldIII, 3_600_000_000 },
        { AchievementTier.RubyI, 9_000_000_000 },
        { AchievementTier.RubyII, 18_000_000_000 },
        { AchievementTier.RubyIII, 36_000_000_000 },
        { AchievementTier.MasterI, 90_000_000_000 },
        { AchievementTier.MasterII, 180_000_000_000 },
        { AchievementTier.MasterIII, 360_000_000_000 },
    };

    public static readonly Dictionary<AchievementTier, ulong> SwiftThresholds = new()
    {
        { AchievementTier.BronzeI, 100 },
        { AchievementTier.BronzeII, 125 },
        { AchievementTier.BronzeIII, 150 },
        { AchievementTier.SilverI, 200 },
        { AchievementTier.SilverII, 250 },
        { AchievementTier.SilverIII, 300 },
        { AchievementTier.GoldI, 350 },
        { AchievementTier.GoldII, 400 },
        { AchievementTier.GoldIII, 450 },
        { AchievementTier.RubyI, 500 },
        { AchievementTier.RubyII, 550 },
        { AchievementTier.RubyIII, 600 },
        { AchievementTier.MasterI, 700 },
        { AchievementTier.MasterII, 800 },
        { AchievementTier.MasterIII, 900 },
    };

    public static readonly Dictionary<AchievementTier, ulong> ConsistentThresholds = new()
    {
        { AchievementTier.BronzeI, 7 },
        { AchievementTier.BronzeII, 14 },
        { AchievementTier.BronzeIII, 21 },
        { AchievementTier.SilverI, 30 },
        { AchievementTier.SilverII, 60 },
        { AchievementTier.SilverIII, 90 },
        { AchievementTier.GoldI, 120 },
        { AchievementTier.GoldII, 150 },
        { AchievementTier.GoldIII, 180 },
        { AchievementTier.RubyI, 210 },
        { AchievementTier.RubyII, 240 },
        { AchievementTier.RubyIII, 270 },
        { AchievementTier.MasterI, 400 },
        { AchievementTier.MasterII, 600 },
        { AchievementTier.MasterIII, 900 },
    };

    public static readonly Dictionary<AchievementTier, ulong> CumulativeThresholds = new()
    {
        { AchievementTier.BronzeI, 10 },
        { AchievementTier.BronzeII, 50 },
        { AchievementTier.BronzeIII, 100 },
        { AchievementTier.SilverI, 250 },
        { AchievementTier.SilverII, 500 },
        { AchievementTier.SilverIII, 750 },
        { AchievementTier.GoldI, 1_500 },
        { AchievementTier.GoldII, 3_000 },
        { AchievementTier.GoldIII, 4_500 },
        { AchievementTier.RubyI, 10_000 },
        { AchievementTier.RubyII, 15_000 },
        { AchievementTier.RubyIII, 20_000 },
        { AchievementTier.MasterI, 100_000 },
        { AchievementTier.MasterII, 250_000 },
        { AchievementTier.MasterIII, 500_000 },
    };
}
