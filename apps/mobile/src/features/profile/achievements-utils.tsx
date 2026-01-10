import { ImageSourcePropType } from "react-native";
import {
  AchievementTier,
  AchievementProgress,
} from "../../common/api/api-definitions";
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
    [AchievementTier.None]: "profile.achievementTier.none",
    [AchievementTier.Achieved]: "profile.achievementTier.achieved",
    [AchievementTier.BronzeI]: "profile.achievementTier.bronzeI",
    [AchievementTier.BronzeII]: "profile.achievementTier.bronzeII",
    [AchievementTier.BronzeIII]: "profile.achievementTier.bronzeIII",
    [AchievementTier.SilverI]: "profile.achievementTier.silverI",
    [AchievementTier.SilverII]: "profile.achievementTier.silverII",
    [AchievementTier.SilverIII]: "profile.achievementTier.silverIII",
    [AchievementTier.GoldI]: "profile.achievementTier.goldI",
    [AchievementTier.GoldII]: "profile.achievementTier.goldII",
    [AchievementTier.GoldIII]: "profile.achievementTier.goldIII",
    [AchievementTier.RubyI]: "profile.achievementTier.rubyI",
    [AchievementTier.RubyII]: "profile.achievementTier.rubyII",
    [AchievementTier.RubyIII]: "profile.achievementTier.rubyIII",
    [AchievementTier.MasterI]: "profile.achievementTier.masterI",
    [AchievementTier.MasterII]: "profile.achievementTier.masterII",
    [AchievementTier.MasterIII]: "profile.achievementTier.masterIII",
  };
  return tierKeys[tier];
};

export const achievementImages: Record<string, ImageSourcePropType> = {
  totalDistance: require("../../../assets/achievements/TotalDistance.png"),
  totalDuration: require("../../../assets/achievements/TotalDuration.png"),
  totalActivities: require("../../../assets/achievements/TotalActivities.png"),
  maxCurrentStreak: require("../../../assets/achievements/MaxCurrentStreak.png"),
  maxActivitySpeed: require("../../../assets/achievements/MaxActivitySpeed.png"),
  maxActivityDistance: require("../../../assets/achievements/MaxActivityDistance.png"),
  maxActivityDuration: require("../../../assets/achievements/MaxActivityDuration.png"),
  greenhorn: require("../../../assets/achievements/Greenhorn.png"),
  marathoner: require("../../../assets/achievements/Marathoner.png"),
};

export const isAchievementProgress = (
  obj: unknown
): obj is AchievementProgress => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "tier" in obj &&
    "progress" in obj &&
    "achievedAt" in obj
  );
};

export const isAchievementKey = (key: string): boolean => {
  return !["id", "userId"].includes(key);
};
