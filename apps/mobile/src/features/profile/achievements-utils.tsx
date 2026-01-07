import { AchievementTier } from "../../common/api/api-definitions";
import { theme } from "../../common/theme";

export const getAchievementTierColor = (tier: AchievementTier) => {
  switch (tier) {
    case AchievementTier.None:
      return theme.colors.achievements.none;
    case AchievementTier.Achieved:
      return theme.colors.achievements.achieved;
    case AchievementTier.BronzeI:
    case AchievementTier.BronzeII:
    case AchievementTier.BronzeIII:
      return theme.colors.achievements.bronze;
    case AchievementTier.SilverI:
    case AchievementTier.SilverII:
    case AchievementTier.SilverIII:
      return theme.colors.achievements.silver;
    case AchievementTier.GoldI:
    case AchievementTier.GoldII:
    case AchievementTier.GoldIII:
      return theme.colors.achievements.gold;
    case AchievementTier.RubyI:
    case AchievementTier.RubyII:
    case AchievementTier.RubyIII:
      return theme.colors.achievements.ruby;
    case AchievementTier.MasterI:
    case AchievementTier.MasterII:
    case AchievementTier.MasterIII:
      return theme.colors.achievements.master;
  }
};

export const getTierName = (tier: AchievementTier) => {
  const tierKeys: Record<number, string> = {
    [AchievementTier.None]: "profile.achievement.none",
    [AchievementTier.Achieved]: "profile.achievement.achieved",
    [AchievementTier.BronzeI]: "profile.achievement.bronzeI",
    [AchievementTier.BronzeII]: "profile.achievement.bronzeII",
    [AchievementTier.BronzeIII]: "profile.achievement.bronzeIII",
    [AchievementTier.SilverI]: "profile.achievement.silverI",
    [AchievementTier.SilverII]: "profile.achievement.silverII",
    [AchievementTier.SilverIII]: "profile.achievement.silverIII",
    [AchievementTier.GoldI]: "profile.achievement.goldI",
    [AchievementTier.GoldII]: "profile.achievement.goldII",
    [AchievementTier.GoldIII]: "profile.achievement.goldIII",
    [AchievementTier.RubyI]: "profile.achievement.rubyI",
    [AchievementTier.RubyII]: "profile.achievement.rubyII",
    [AchievementTier.RubyIII]: "profile.achievement.rubyIII",
    [AchievementTier.MasterI]: "profile.achievement.masterI",
    [AchievementTier.MasterII]: "profile.achievement.masterII",
    [AchievementTier.MasterIII]: "profile.achievement.masterIII",
  };
  return tierKeys[tier];
};
