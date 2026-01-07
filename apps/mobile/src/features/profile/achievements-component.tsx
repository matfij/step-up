import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { achievementsClient } from "../../common/api/achievements-client";
import { useRequest } from "../../common/api/api-hooks";
import { theme, themeComposable } from "../../common/theme";
import { getAchievementTierColor, getTierName } from "./achievements-utils";

type AchievementsComponentProps = {
  userId: string;
};

export const AchievementsComponent = (props: AchievementsComponentProps) => {
  const { t } = useTranslation();
  const getAchievements = useRequest(achievementsClient.getByUserId);

  useEffect(() => {
    getAchievements.call(props.userId);
  }, [props.userId]);

  return (
    <View style={styles.achievementsWrapper}>
      <Text style={styles.achievementsLabel}>{t("profile.achievements")}</Text>

      {getAchievements.loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary[500]} />
        </View>
      )}

      {getAchievements.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t(getAchievements.error.key)}</Text>
        </View>
      )}

      {getAchievements.data && (
        <View style={styles.achievementsList}>
          {Object.entries(getAchievements.data).map(([key, value]) => {
            if (key === "id" || key === "userId" || typeof value !== "object")
              return null;

            const achievement = value as any;
            return (
              <View key={key} style={styles.achievementItem}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementName}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Text>
                  <Text
                    style={[
                      styles.achievementTier,
                      { color: getAchievementTierColor(achievement.tier) },
                    ]}
                  >
                    {t(getTierName(achievement.tier))}
                  </Text>
                </View>
                <Text style={styles.achievementProgress}>
                  Progress: {achievement.progress}
                  {achievement.nextTierProgress &&
                    ` / ${achievement.nextTierProgress}`}
                </Text>
              </View>
            );
          })}
        </View>
      )}
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
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.status.error + "20",
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.status.error,
  },
  achievementsList: {
    gap: theme.spacing.sm,
  },
  achievementItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.dark[200],
  },
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  achievementName: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[100],
    textTransform: "capitalize",
  },
  achievementTier: {
    ...themeComposable.typography.bodySmall,
    fontWeight: "600",
  },
  achievementProgress: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[400],
  },
});
