import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { formatDistance, formatDuration } from "../../common/formatters";
import { theme, themeComposable } from "../../common/theme";
import { withAlpha } from "../../common/utils";
import { Progress } from "../../common/api/api-definitions";

interface ProgressComponentProps {
  progress: Progress;
  loading: boolean;
}

export const ProgressComponent = (props: ProgressComponentProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.streakWrapper}>
        <View style={styles.streakItem}>
          <View style={styles.streakValueWrapper}>
            <Text style={styles.streakValue}>
              {props.progress.currentStreak}
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
            <Text style={styles.streakValue}>{props.progress.bestStreak}</Text>
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
          <Text style={styles.statValue}>{props.progress.totalActivities}</Text>
          <Text style={styles.statLabel}>{t("profile.totalActivities")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDuration(props.progress.totalDuration, t)}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalDuration")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDistance(props.progress.totalDistance, t)}
          </Text>
          <Text style={styles.statLabel}>{t("profile.totalDistance")}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressWrapper: {
    display: "flex",
    gap: theme.spacing.sm,
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
      theme.opacity.liquid,
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
