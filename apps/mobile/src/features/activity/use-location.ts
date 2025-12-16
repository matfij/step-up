import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { ActivityReport } from "./definitions";
import { getAsyncStorageItem, setAsyncStorageItem } from "../../common/utils";
import { calculateRouteLength } from "./distance-manager";
import { getAverageSpeed, getCurrentSpeed, getTopSpeed } from "./speed-manager";
import { getActivityDuration } from "./time-manager";
import { appConfig } from "../../common/config";
import { startLocationTracking } from "./location-manager";

const REFRESH_TIME_MS = 1000;

export const useLocation = () => {
  const appState = useRef(AppState.currentState);
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [activityReport, setActivityReport] = useState<ActivityReport>();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isTracking) {
      return;
    }
    const interval = setInterval(async () => {
      try {
        const locations =
          (await getAsyncStorageItem<Location.LocationObject[]>(
            "activityLocation"
          )) ?? [];

        const newDistance = Math.round(calculateRouteLength(locations));
        setDistance(newDistance);

        const newSpeed = Math.round(getCurrentSpeed(locations));
        setSpeed(newSpeed);
      } catch (err) {
        console.warn(err);
      }
    }, REFRESH_TIME_MS);
    return () => {
      clearInterval(interval);
    };
  }, [isTracking]);

  const start = async () => {
    if (isTracking) {
      return;
    }
    await startLocationTracking();
    setIsTracking(true);
  };

  const stop = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation
      );
      setIsTracking(false);
    }
  };

  const complete = async () => {
    await stop();

    const locations =
      (await getAsyncStorageItem<Location.LocationObject[]>(
        "activityLocation"
      )) ?? [];

    const newActivityReport: ActivityReport = {
      duration: getActivityDuration(locations),
      distance: Math.round(calculateRouteLength(locations)),
      averageSpeed: getAverageSpeed(locations),
      topSpeed: getTopSpeed(locations),
      route: locations.map((location) => location.coords),
    };

    setActivityReport(newActivityReport);
    setDistance(0);
    setSpeed(0);

    await setAsyncStorageItem("activityLocation", []);
  };

  return {
    isTracking,
    distance,
    speed,
    activityReport,
    start,
    stop,
    complete,
  };
};
