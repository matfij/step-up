import { useEffect } from "react";
import { Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { AppWrapper } from "../../common/components/app-wrapper";
import { useUserStore } from "../../common/state/user-store";
import { progressClient } from "../../common/api/progress-client";
import { useRequest } from "../../common/api/api-hooks";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";
import { withAlpha } from "../../common/utils";
import { formatDuration } from "../activity/time-manager";
import { activityClient } from "../../common/api/activity-client";
import { LastActivityComponent } from "./last-activity-component";

export const ProfileComponent = () => {
  const { t } = useTranslation();
  const { user, progress, setProgress } = useUserStore();
  const getProgress = useRequest(progressClient.getByUser);
  const getLastActivity = useRequest(activityClient.getByUserId);

  const lastActivity = getLastActivity.data?.[0];

  useEffect(() => {
    if (!progress && user && !getProgress.loading) {
      getProgress.call(undefined);
    }
    if (user && !getLastActivity.loading && !getLastActivity.data) {
      getLastActivity.call({ userId: user.id, skip: 0, take: 1 });
    }
  }, [user, progress]);

  useEffect(() => {
    if (getProgress.success && getProgress.data) {
      setProgress(getProgress.data);
    }
  }, [getProgress.success, getProgress.data]);

  if (getProgress.loading || !progress || !user) {
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
            <Text style={styles.levelText}>{progress.level}</Text>
          </View>
        </View>
        <Text style={styles.userLabel}>{user.username}</Text>
      </View>

      <View style={styles.statsWrapper}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.totalActivities}</Text>
          <Text style={styles.statLabel}>{t("profile.totalActivities")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDuration(progress.totalDuration)}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalDuration")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.totalDistance}</Text>
          <Text style={styles.statLabel}>{t("profile.totalDistance")}</Text>
        </View>
      </View>

      {lastActivity && <LastActivityComponent activity={lastActivity} />}
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
  statsWrapper: {
    width: "90%",
    flexDirection: "row",
    marginTop: -theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderBottomColor: theme.colors.light[300],
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.dark[200],
  },
  statValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.primary[400],
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
