import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { theme, themeComposable } from "../../common/theme";
import { AppButton } from "../../common/components/app-button";
import { useActivity } from "./use-activity";
import { AppWrapper } from "../../common/components/app-wrapper";
import { formatDuration } from "./time-manager";

export const ActivityComponent = () => {
  const { t } = useTranslation();
  const activity = useActivity();
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | undefined>();

  return (
    <AppWrapper>
      <View style={styles.container}>
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

        <View style={styles.glassContainer}>
          {activity.isTracking && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activity.distance}</Text>
                <Text style={styles.statLabel}>{t("activity.distance")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatDuration(activity.duration)}
                </Text>
                <Text style={styles.statLabel}>{t("activity.duration")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activity.speed}</Text>
                <Text style={styles.statLabel}>{t("activity.speed")}</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {!activity.isTracking && (
              <AppButton
                label={t("activity.start")}
                onClick={activity.start}
                style={styles.button}
              />
            )}
            {activity.isTracking && (
              <>
                <AppButton
                  label={t("activity.stop")}
                  onClick={activity.stop}
                  style={styles.button}
                />
                <AppButton
                  label={t("activity.complete")}
                  onClick={activity.complete}
                  style={styles.button}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  glassContainer: {
    ...themeComposable.shadows.xl,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  statsRow: {
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
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});
