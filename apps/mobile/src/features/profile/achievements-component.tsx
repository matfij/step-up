import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { achievementsClient } from "../../common/api/achievements-client";
import { AchievementTier } from "../../common/api/api-definitions";
import { useRequest } from "../../common/api/use-request";
import { theme, themeComposable } from "../../common/theme";
import {
  achievementImages,
  getAchievementTierColor,
} from "./achievements-utils";
import { SkeletonItem } from "../../common/components/skeleton-item";
import { withAlpha } from "../../common/utils";
import { Achievement, AchievementModal } from "./achievement-modal";

interface AchievementsComponentProps {
  userId?: string;
}

const skeletonColor = withAlpha(theme.colors.dark[300], theme.opacity.mist);

export const AchievementsComponent = (props: AchievementsComponentProps) => {
  const { t } = useTranslation();
  const getAchievements = useRequest(achievementsClient.getByUserId);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement>();

  const emptyAchievements =
    getAchievements.success &&
    getAchievements.data?.achievements?.filter(
      (achievement) => achievement.tier !== AchievementTier.None,
    ).length === 0;

  useFocusEffect(
    useCallback(() => {
      if (props.userId) {
        getAchievements.call(props.userId, false);
      }
    }, [props.userId]),
  );

  useEffect(() => {
    if (getAchievements.data && getAchievements.success) {
      const newAchievements = getAchievements.data.achievements
        ?.filter((achievement) => achievement.tier !== AchievementTier.None)
        ?.map((achievement) => ({
          label: t(`profile.achievementName.${achievement.name}`),
          description: t(`profile.achievementDescription.${achievement.name}`),
          image: achievementImages[achievement.name],
          color: getAchievementTierColor(achievement.tier),
          ...achievement,
        }))
        ?.sort((a, b) => b.tier - a.tier);
      setAchievements(newAchievements);
    }
  }, [getAchievements.data, getAchievements.success, t]);

  return (
    <View style={styles.achievementsWrapper}>
      <Text style={styles.achievementsLabel}>{t("profile.achievements")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {getAchievements.loading &&
          Array.from({ length: 10 }).map((_, index) => (
            <SkeletonItem
              key={`skeleton-${index}`}
              width={54}
              height={54}
              color={skeletonColor}
              style={styles.achievementItem}
            />
          ))}
        {!getAchievements.loading &&
          achievements?.map((achievement) => (
            <Pressable
              key={achievement.label}
              onPress={() => setSelectedAchievement(achievement)}
              style={({ pressed }) => [
                styles.achievementItem,
                { borderColor: achievement.color },
                pressed && { opacity: theme.opacity.glass },
              ]}
            >
              <Image
                style={styles.achievementImage}
                source={achievement.image}
              />
            </Pressable>
          ))}
      </ScrollView>

      {emptyAchievements && (
        <Text style={styles.emptyLabel}>{t("profile.noAchievements")}</Text>
      )}
      <AchievementModal
        achievement={selectedAchievement}
        visible={selectedAchievement !== undefined}
        onClose={() => setSelectedAchievement(undefined)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  achievementsWrapper: {
    width: "90%",
    paddingBottom: theme.spacing.md,
    borderBottomColor: theme.colors.light[300],
    borderBottomWidth: 1,
  },
  achievementsLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[200],
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  achievementItem: {
    marginRight: theme.spacing.sm,
    overflow: "hidden",
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
  },
  achievementImage: {
    width: 50,
    height: 50,
  },
  emptyLabel: {
    height: 50,
    padding: theme.spacing.md,
    color: theme.colors.light[300],
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.md,
  },
});
