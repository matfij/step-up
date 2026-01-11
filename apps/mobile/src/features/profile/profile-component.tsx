import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppWrapper } from "../../common/components/app-wrapper";
import { useUserStore } from "../../common/state/user-store";
import { progressClient } from "../../common/api/progress-client";
import { useRequest } from "../../common/api/api-hooks";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";
import { withAlpha } from "../../common/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AchievementsComponent } from "./achievements-component";
import { formatDistance, formatDuration } from "../../common/formatters";

export const ProfileComponent = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const getProgress = useRequest(progressClient.getByUserId);

  useEffect(() => {
    if (user) {
      getProgress.call(user.id);
    }
  }, []);

  if (!user || !getProgress.data) {
    return <></>;
  }

  return (
    <AppWrapper>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImage}
            source={require("@assets/images/avatar.png")}
          />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{getProgress.data.level}</Text>
          </View>
        </View>
        <Text style={styles.userLabel}>{user.username}</Text>
      </View>

      <View style={styles.streakWrapper}>
        <View style={styles.streakItem}>
          <View style={styles.streakValueWrapper}>
            <Text style={styles.streakValue}>
              {getProgress.data.currentStreak}
            </Text>
            <MaterialCommunityIcons
              name="fire"
              size={25}
              style={styles.streakIcon}
            />
          </View>
          <Text style={styles.streakLabel}>{t("profile.currentStreak")}</Text>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakItem}>
          <View style={styles.streakValueWrapper}>
            <Text style={styles.streakValue}>
              {getProgress.data.bestStreak}
            </Text>
            <MaterialCommunityIcons
              name="star"
              size={25}
              style={styles.streakIcon}
            />
          </View>
          <Text style={styles.streakLabel}>{t("profile.bestStreak")}</Text>
        </View>
      </View>

      <View style={styles.statsWrapper}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {getProgress.data.totalActivities}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalActivities")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDuration(getProgress.data.totalDuration, t)}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalDuration")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDistance(getProgress.data.totalDistance, t)}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalDistance")}</Text>
        </View>
      </View>

      <AchievementsComponent userId={user.id} />
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    width: "90%",
    alignItems: "center",
    borderBottomColor: theme.colors.light[300],
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.dark[100],
    borderWidth: 3,
  },
  levelBadge: {
    ...themeComposable.shadows.secondaryMd,
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary[500],
    borderColor: theme.colors.dark[100],
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    opacity: theme.opacity.glass,
  },
  levelText: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.dark[700],
    fontSize: 18,
  },
  userLabel: {
    ...themeComposable.typography.h1,
    color: theme.colors.light[100],
  },
  streakWrapper: {
    width: "90%",
    flexDirection: "row",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: withAlpha(
      theme.colors.secondary[500],
      theme.opacity.liquid
    ),
  },
  streakItem: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  streakValueWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  streakIcon: {
    marginTop: theme.spacing.xs,
    color: theme.colors.secondary[200],
  },
  streakValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.secondary[300],
    fontWeight: "700",
  },
  streakLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[100],
    textTransform: "uppercase",
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.light[300],
  },
  statsWrapper: {
    width: "90%",
    flexDirection: "row",
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    borderBottomColor: theme.colors.light[300],
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.dark[200],
    borderRadius: theme.borderRadius.sm,
  },
  statValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.primary[400],
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.primary[200],
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 11,
  },
});
