import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
} from "react-native";
import { achievementsClient } from "../../common/api/achievements-client";
import { useRequest } from "../../common/api/api-hooks";
import { theme, themeComposable } from "../../common/theme";
import {
  achievementImages,
  getAchievementTierColor,
  getAchievementTierName,
  isAchievementKey,
  isAchievementProgress,
} from "./achievements-utils";
import {
  AchievementProgress,
  AchievementTier,
} from "../../common/api/api-definitions";
import { withAlpha } from "../../common/utils";

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
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement>();

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

  const getProgressPercentage = (achievement: Achievement): number => {
    if (!achievement.nextTierProgress || achievement.nextTierProgress === 0) {
      return 100;
    }
    return Math.min(
      (achievement.progress / achievement.nextTierProgress) * 100,
      100
    );
  };

  return (
    <View style={styles.achievementsWrapper}>
      <Text style={styles.achievementsLabel}>{t("profile.achievements")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {achievements.map((achievement) => (
          <Pressable
            key={achievement.name}
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

      <Modal
        visible={selectedAchievement !== undefined}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedAchievement(undefined)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedAchievement(undefined)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedAchievement && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    style={styles.modalImage}
                    source={selectedAchievement.image}
                  />
                  <View>
                    <Text style={styles.modalTitle}>
                      {selectedAchievement.name}
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

                {selectedAchievement.tier !== AchievementTier.Achieved && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>
                        {t("profile.progress")}
                      </Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${getProgressPercentage(
                              selectedAchievement
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
          </Pressable>
        </Pressable>
      </Modal>
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
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: withAlpha(theme.colors.dark[400], theme.opacity.glass),
  },
  modalContent: {
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "85%",
    maxWidth: 400,
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
    // marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
  modalDescription: {
    ...themeComposable.typography.body,
    color: theme.colors.light[300],
    marginBottom: theme.spacing.lg,
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
