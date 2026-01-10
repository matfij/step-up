import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageSourcePropType,
} from "react-native";
import { achievementsClient } from "../../common/api/achievements-client";
import { useRequest } from "../../common/api/api-hooks";
import { theme, themeComposable } from "../../common/theme";
import {
  achievementImages,
  getAchievementTierColor,
  isAchievementKey,
  isAchievementProgress,
} from "./achievements-utils";
import {
  AchievementProgress,
  AchievementTier,
} from "../../common/api/api-definitions";

interface AchievementsComponentProps {
  userId: string;
}

interface Achievement extends AchievementProgress {
  name: string;
  description: string;
  image: ImageSourcePropType;
  color: string;
}

export const AchievementsComponent = (props: AchievementsComponentProps) => {
  const { t } = useTranslation();
  const getAchievements = useRequest(achievementsClient.getByUserId);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    getAchievements.call(props.userId);
  }, [props.userId]);

  useEffect(() => {
    if (getAchievements.data && getAchievements.success) {
      const newAchievements = Object.entries(getAchievements.data)
        .filter(
          (entry): entry is [string, AchievementProgress] =>
            isAchievementKey(entry[0]) && isAchievementProgress(entry[1])
        )
        .map(([key, value]) => ({
          name: t(`profile.achievementName.${key}`),
          description: t(`profile.achievementDescription.${key}`),
          image: achievementImages[key],
          color: getAchievementTierColor(value.tier),
          ...value,
        }))
        .filter((achievement) => achievement.tier !== AchievementTier.None)
        .sort((a, b) => b.tier - a.tier);

      setAchievements(newAchievements);
    }
  }, [getAchievements.data, getAchievements.success, t]);

  return (
    <View style={styles.achievementsWrapper}>
      <Text style={styles.achievementsLabel}>{t("profile.achievements")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {achievements.map((achievement) => (
          <View
            key={achievement.name}
            style={{
              ...styles.achievementItem,
              borderColor: achievement.color,
            }}
          >
            <Image style={styles.achievementImage} source={achievement.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  achievementsWrapper: {
    width: "90%",
  },
  achievementsLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[200],
    marginBottom: theme.spacing.md,
  },
  achievementItem: {
    marginRight: theme.spacing.sm,
    overflow: "hidden",
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
  },
  achievementImage: {
    width: 50,
    height: 50,
  },
});
