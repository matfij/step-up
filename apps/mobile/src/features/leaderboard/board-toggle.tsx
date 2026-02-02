import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";
import { withAlpha } from "../../common/utils";

export type BoardKey =
  | "duration"
  | "distance"
  | "monthlyDuration"
  | "monthlyDistance";

type BoardToggleProps = {
  board: BoardKey;
  onChange: (key: BoardKey) => void;
};

const boardOptions = [
  { board: "duration", label: "leaderboard.duration" },
  { board: "distance", label: "leaderboard.distance" },
  { board: "monthlyDuration", label: "leaderboard.monthlyDuration" },
  { board: "monthlyDistance", label: "leaderboard.monthlyDistance" },
] as const;

export const BoardToggle = (props: BoardToggleProps) => {
  const { t } = useTranslation();

  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {boardOptions.map((option) => {
        const selected = option.board === props.board;
        return (
          <TouchableOpacity
            key={option.board}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => props.onChange(option.board)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {t(option.label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xs,
    backgroundColor: withAlpha(theme.colors.secondary[600], 0.4),
    gap: theme.spacing.xs,
  },
  option: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  optionSelected: {
    backgroundColor: withAlpha(theme.colors.secondary[400], theme.opacity.mist),
  },
  label: {
    ...themeComposable.typography.body,
    color: theme.colors.light[200],
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  labelSelected: {
    color: theme.colors.light[100],
    fontWeight: "600",
  },
});
