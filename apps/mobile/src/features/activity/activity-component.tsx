import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";
import { AppButton } from "../../common/components/app-button";
import { AppWrapper } from "../../common/components/app-wrapper";
import { ConfirmModal } from "../../common/components/confim-modal";
import { theme, themeComposable } from "../../common/theme";
import { withAlpha } from "../../common/utils";
import { ActivityReportModal } from "./activity-report-modal";
import { formatActivityDuration } from "./time-manager";
import { useActivity } from "./use-activity";

export const ActivityComponent = () => {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const activity = useActivity();
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | undefined>();
  const [showReport, setShowReport] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (activity.activityReport) {
      setShowReport(true);
    }
  }, [activity.activityReport]);

  const onConfirmComplete = () => {
    setShowFinishModal(false);
    activity.complete();
  };

  const onClose = (navigateToIndex: boolean) => {
    setShowReport(false);
    if (navigateToIndex) {
      navigate("/(tabs)");
    }
  };

  const onDiscard = () => {
    setShowDiscardModal(false);
    setShowReport(false);
    activity.discard();
  };

  return (
    <AppWrapper>
      <View style={styles.mainWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          onUserLocationChange={(e) => {
            if (e.nativeEvent.coordinate && mapRef.current) {
              const newRegion: Region = {
                latitude: e.nativeEvent.coordinate?.latitude,
                longitude: e.nativeEvent.coordinate?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              setRegion(newRegion);
              mapRef.current.animateToRegion(newRegion, 300);
            }
          }}
        />

        <View style={styles.controlsWrapper}>
          {activity.isTracking && (
            <View style={styles.statsWrapper}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activity.distance}</Text>
                <Text style={styles.statLabel}>{t("activity.distance")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatActivityDuration(activity.duration)}
                </Text>
                <Text style={styles.statLabel}>{t("activity.duration")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activity.speed}</Text>
                <Text style={styles.statLabel}>{t("activity.speed")}</Text>
              </View>
            </View>
          )}

          {activity.error && (
            <Text style={styles.errorLabel}>{t(activity.error)}</Text>
          )}

          <View style={styles.buttonContainer}>
            {!activity.isTracking && (
              <AppButton
                label={t("activity.start")}
                onClick={activity.start}
                style={styles.button}
              />
            )}
            {activity.isPaused && (
              <AppButton
                label={t("activity.resume")}
                onClick={activity.resume}
                style={styles.button}
              />
            )}
            {activity.isTracking && !activity.isPaused && (
              <AppButton
                label={t("activity.stop")}
                onClick={activity.pause}
                style={styles.button}
              />
            )}
            {activity.isTracking && (
              <AppButton
                label={t("activity.complete")}
                onClick={() => setShowFinishModal(true)}
                style={styles.button}
              />
            )}
          </View>
        </View>
      </View>
      {activity.activityReport && (
        <ActivityReportModal
          visible={showReport}
          report={activity.activityReport}
          onDiscard={() => setShowDiscardModal(true)}
          onClose={onClose}
        />
      )}
      <ConfirmModal
        visible={showFinishModal}
        message={t("activity.confirmFinish")}
        onConfirm={onConfirmComplete}
        onClose={() => setShowFinishModal(false)}
      />
      <ConfirmModal
        visible={showDiscardModal}
        message={t("activity.confirmDiscard")}
        onConfirm={onDiscard}
        onClose={() => setShowDiscardModal(false)}
      />
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  controlsWrapper: {
    ...themeComposable.shadows.xl,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: withAlpha(theme.colors.dark[500], theme.opacity.glass),
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  statsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light[500],
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.light[100],
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  statLabel: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 12,
  },
  errorLabel: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.status.error,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});
