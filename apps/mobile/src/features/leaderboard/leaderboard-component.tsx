import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppWrapper } from "../../common/components/app-wrapper";
import { useRequest } from "../../common/api/use-request";
import { progressClient } from "../../common/api/progress-client";
import { useEffect, useState } from "react";
import { Progress } from "../../common/api/api-definitions";
import { theme, themeComposable } from "../../common/theme";
import { BoardKey, BoardToggle } from "./board-toggle";
import { formatDistance, formatDuration } from "../../common/formatters";
import { withAlpha } from "../../common/utils";

export const LeaderboardComponent = () => {
  const { t } = useTranslation();
  const [currentBoard, setCurrentBoard] = useState<BoardKey>("distance");
  const getBestDuration = useRequest(progressClient.getBestDuration);
  const getBestDistance = useRequest(progressClient.getBestDistance);
  const getBestMonthlyDuration = useRequest(
    progressClient.getBestMonthlyDuration,
  );
  const getBestMonthlyDistance = useRequest(
    progressClient.getBestMonthlyDistance,
  );
  const [leaderboardData, setLeaderboardData] = useState<Progress[]>([]);

  useEffect(() => {
    switch (currentBoard) {
      case "duration":
        if (!getBestDuration.data && !getBestDuration.loading) {
          getBestDuration.call(undefined);
        }
        break;
      case "distance":
        if (!getBestDistance.data && !getBestDistance.loading) {
          getBestDistance.call(undefined);
        }
        break;
      case "monthlyDuration":
        if (!getBestMonthlyDuration.data && !getBestMonthlyDuration.loading) {
          getBestMonthlyDuration.call(undefined);
        }
        break;
      case "monthlyDistance":
        if (!getBestMonthlyDistance.data && !getBestMonthlyDistance.loading) {
          getBestMonthlyDistance.call(undefined);
        }
        break;
    }
  }, [currentBoard]);

  useEffect(() => {
    switch (currentBoard) {
      case "duration":
        if (getBestDuration.data) {
          setLeaderboardData(getBestDuration.data);
        }
        break;
      case "distance":
        if (getBestDistance.data) {
          setLeaderboardData(getBestDistance.data);
        }
        break;
      case "monthlyDuration":
        if (getBestMonthlyDuration.data) {
          setLeaderboardData(getBestMonthlyDuration.data);
        }
        break;
      case "monthlyDistance":
        if (getBestMonthlyDistance.data) {
          setLeaderboardData(getBestMonthlyDistance.data);
        }
        break;
    }
  }, [
    currentBoard,
    getBestDuration.data,
    getBestDistance.data,
    getBestMonthlyDuration.data,
    getBestMonthlyDistance.data,
  ]);

  const getScore = (progress: Progress) => {
    switch (currentBoard) {
      case "duration":
        return formatDuration(progress.totalDuration, t);
      case "distance":
        return formatDistance(progress.totalDistance, t);
      case "monthlyDuration":
        return formatDuration(progress.monthlyDuration, t);
      case "monthlyDistance":
        return formatDistance(progress.monthlyDistance, t);
    }
  };

  return (
    <AppWrapper>
      <View style={styles.mainWrapper}>
        <Text style={styles.title}>{t("leaderboard.title")}</Text>
        <View style={styles.leadersWrapper}>
          <View style={styles.leaderHeaderItem}>
            <Text style={styles.leaderHeaderLabel}>
              {t("leaderboard.athlete")}
            </Text>
            <Text style={styles.leaderHeaderLabel}>
              {t("leaderboard.score")}
            </Text>
          </View>
          {leaderboardData.map((leader, index) => (
            <View key={leader.id} style={styles.leaderItem}>
              <View style={styles.leaderRankContainer}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.leaderLabel}>{leader.username}</Text>
              </View>
              <Text style={styles.leaderScore}>{getScore(leader)}</Text>
            </View>
          ))}
        </View>
        <BoardToggle
          board={currentBoard}
          onChange={(board) => setCurrentBoard(board)}
        />
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    height: "100%",
    justifyContent: "flex-end",
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  title: {
    ...themeComposable.typography.h2,
    color: theme.colors.secondary[200],
  },
  leadersWrapper: {
    height: "50%",
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  leaderHeaderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: withAlpha(theme.colors.secondary[500], theme.opacity.mist),
    borderBottomColor: theme.colors.secondary[400],
    borderBottomWidth: 2,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  leaderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: withAlpha(
      theme.colors.secondary[500],
      theme.opacity.ether,
    ),
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: withAlpha(theme.colors.secondary[400], 0.3),
  },
  leaderRankContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withAlpha(theme.colors.secondary[500], theme.opacity.mist),
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
    fontSize: 14,
  },
  leaderHeaderLabel: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.secondary[200],
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontSize: 12,
  },
  leaderLabel: {
    ...themeComposable.typography.body,
    color: theme.colors.secondary[200],
    fontSize: 15,
  },
  leaderScore: {
    ...themeComposable.typography.body,
    color: theme.colors.light[200],
    fontSize: 15,
    fontWeight: "600",
  },
});
