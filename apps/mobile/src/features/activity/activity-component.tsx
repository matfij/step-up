import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { theme, themeComposable } from "../../common/theme";
import { AppButton } from "../../common/components/app-button";
import { useActivity } from "./use-activity";
import { AppWrapper } from "../../common/components/app-wrapper";
import { formatDuration } from "./time-manager";

export const ActivityComponent = () => {
  const { t } = useTranslation();
  const activity = useActivity();

  return (
    <AppWrapper>
      {activity.isTracking && (
        <View>
          <Text style={styles.label}>
            {t("activity.distance", { value: activity.distance })}
          </Text>
          <Text style={styles.label}>
            {t("activity.speed", { value: activity.speed })}
          </Text>
          <Text style={styles.label}>
            {t("activity.duration", {
              value: formatDuration(activity.duration),
            })}
          </Text>
        </View>
      )}
      {!activity.isTracking && (
        <AppButton
          label={t("activity.start")}
          onClick={activity.start}
          style={{ width: "50%" }}
        />
      )}
      {activity.isTracking && (
        <AppButton
          label={t("activity.stop")}
          onClick={activity.stop}
          style={{ width: "50%" }}
        />
      )}
      {activity.isTracking && (
        <AppButton
          label={t("activity.complete")}
          onClick={activity.complete}
          style={{ width: "50%" }}
        />
      )}
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    ...themeComposable.typography.h2,
    color: theme.colors.light[300],
  },
  label: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
  },
});
