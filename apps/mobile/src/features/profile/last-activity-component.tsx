import { useEffect, useMemo, useRef, useTransition } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import { Activity } from "../../common/api/api-definitions";
import { theme, themeComposable } from "../../common/theme";
import { formatActivityDuration } from "../activity/time-manager";
import { useTranslation } from "react-i18next";
import { withAlpha } from "../../common/utils";

type LastActivityComponentProps = {
  activity: Activity;
};

export const LastActivityComponent = (props: LastActivityComponentProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);

  const coordinates = useMemo(
    () =>
      props.activity.routeLatitudes.map((lat, index) => ({
        latitude: lat,
        longitude: props.activity.routeLongitudes[index],
      })),
    [props.activity.routeLatitudes, props.activity.routeLongitudes]
  );

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 10, right: 10, bottom: 20, left: 10 },
        animated: false,
      });
    }, 100);
  }, [props.activity]);

  return (
    <View style={styles.activityWrapper}>
      <Text style={styles.activityName}>{props.activity.name}</Text>
      {props.activity.description && (
        <Text style={styles.activityDescription}>
          {props.activity.description}
        </Text>
      )}
      <MapView
        ref={mapRef}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        style={styles.activityMap}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor={theme.colors.accent[3]}
          strokeWidth={3}
        />
      </MapView>
      <View style={styles.statsWrapper}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{props.activity.distance}</Text>
          <Text style={styles.statLabel}>{t("activity.distance")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatActivityDuration(props.activity.duration)}
          </Text>
          <Text style={styles.statLabel}>{t("activity.duration")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{props.activity.averageSpeed}</Text>
          <Text style={styles.statLabel}>{t("activity.speed")}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityWrapper: {
    width: "90%",
  },
  activityName: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.secondary[200],
  },
  activityDescription: {
    ...themeComposable.typography.body,
    color: theme.colors.light[300],
    fontSize: 12,
  },
  activityMap: {
    marginTop: theme.spacing.sm,
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  emptyMap: {
    backgroundColor: theme.colors.dark[400],
    justifyContent: "center",
    alignItems: "center",
  },
  statsWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: withAlpha(theme.colors.dark[100], theme.opacity.glass),
  },
  statValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.light[100],
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  statLabel: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 12,
  },
});
