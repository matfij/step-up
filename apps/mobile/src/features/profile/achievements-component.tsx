import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { achievementsClient } from "../../common/api/achievements-client";
import {
  AchievementProgress,
  AchievementTier,
  UnitCategory,
} from "../../common/api/api-definitions";
import { useRequest } from "../../common/api/use-request";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatSpeed,
} from "../../common/formatters";
import { theme, themeComposable } from "../../common/theme";
import {
  achievementImages,
  getAchievementTierColor,
  getAchievementTierName,
} from "./achievements-utils";

interface AchievementsComponentProps {
  userId?: string;
}

interface Achievement extends AchievementProgress {
  label: string;
  description: string;
  image: ImageSourcePropType;
  color: string;
  unitCategory: UnitCategory;
}

export const AchievementsComponent = (props: AchievementsComponentProps) => {
  const { t } = useTranslation();
  const getAchievements = useRequest(achievementsClient.getByUserId);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement>();

  const emptyAchievements =
    getAchievements.success &&
    getAchievements.data?.achievements.filter(
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
        .filter((achievement) => achievement.tier !== AchievementTier.None)
        .map((achievement) => ({
          label: t(`profile.achievementName.${achievement.name}`),
          description: t(`profile.achievementDescription.${achievement.name}`),
          image: achievementImages[achievement.name],
          color: getAchievementTierColor(achievement.tier),
          ...achievement,
        }))
        .sort((a, b) => b.tier - a.tier);
      setAchievements(newAchievements);
    }
  }, [getAchievements.data, getAchievements.success, t]);

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.nextTierProgress || achievement.nextTierProgress === 0) {
      return 100;
    }
    return Math.min(
      ((achievement.progress - achievement.currentTierProgress) /
        (achievement.nextTierProgress - achievement.currentTierProgress)) *
        100,
      100,
    );
  };

  const getProgressLabel = (achievement: Achievement) => {
    const current = achievement.progress - achievement.currentTierProgress;
    const next = achievement.nextTierProgress - achievement.currentTierProgress;
    const finished = achievement.tier === AchievementTier.MasterIII;
    switch (achievement.unitCategory) {
      case UnitCategory.Count:
        return finished ? current : `${current} / ${next}`;
      case UnitCategory.Time:
        return finished
          ? formatDuration(current, t)
          : `${formatDuration(current, t)} / ${formatDuration(next, t)}`;
      case UnitCategory.Distance:
        return finished
          ? formatDistance(current, t)
          : `${formatDistance(current, t)} / ${formatDistance(next, t)}`;
      case UnitCategory.Speed:
        return finished
          ? formatSpeed(current, t)
          : `${formatSpeed(current, t)} / ${formatSpeed(next, t)}`;
    }
  };

  return (
    <View style={styles.achievementsWrapper}>
      <Text style={styles.achievementsLabel}>{t("profile.achievements")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {achievements.map((achievement) => (
          <Pressable
            key={achievement.label}
            onPress={() => setSelectedAchievement(achievement)}
            style={({ pressed }) => [
              styles.achievementItem,
              { borderColor: achievement.color },
              pressed && { opacity: theme.opacity.glass },
            ]}
          >
            <Image style={styles.achievementImage} source={achievement.image} />
          </Pressable>
        ))}
      </ScrollView>

      {emptyAchievements && (
        <Text style={styles.emptyLabel}>{t("profile.noAchievements")}</Text>
      )}

      <ModalWrapper
        visible={selectedAchievement !== undefined}
        style={{ width: "95%" }}
        onClose={() => setSelectedAchievement(undefined)}
      >
        <View style={styles.modalContent}>
          {selectedAchievement && (
            <>
              <View style={styles.modalHeader}>
                <Image
                  style={styles.modalImage}
                  source={selectedAchievement.image}
                />
                <View>
                  <Text style={styles.modalTitle}>
                    {selectedAchievement.label}
                  </Text>
                  <Text
                    style={{
                      ...styles.modalTier,
                      color: selectedAchievement.color,
                    }}
                  >
                    {t(getAchievementTierName(selectedAchievement.tier))}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalDescription}>
                {selectedAchievement.description}
              </Text>

              <Text style={styles.modalDate}>
                {formatDate(selectedAchievement.achievedAt)}
              </Text>

              {selectedAchievement.tier !== AchievementTier.Achieved && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {t("profile.progress")}
                    </Text>
                    <Text style={styles.progressLabel}>
                      {getProgressLabel(selectedAchievement)}
                    </Text>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${getProgressPercentage(
                            selectedAchievement,
                          )}%`,
                          backgroundColor: selectedAchievement.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ModalWrapper>
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
  modalContent: {
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.dark[200],
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalImage: {
    width: 64,
    height: 64,
    marginRight: theme.spacing.md,
  },
  modalTitle: {
    ...themeComposable.typography.h2,
    color: theme.colors.light[100],
    flex: 1,
  },
  modalTier: {
    ...themeComposable.typography.body,
    fontWeight: "600",
  },
  modalDescription: {
    ...themeComposable.typography.body,
    color: theme.colors.light[300],
  },
  modalDate: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
    fontSize: 12,
  },
  progressSection: {
    marginTop: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[400],
  },
  progressValue: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[100],
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.dark[400],
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
  },
});
