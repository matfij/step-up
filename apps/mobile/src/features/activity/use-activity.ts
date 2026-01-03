import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { ActivityReport } from "./activity-definitions";
import { getAsyncStorageItem, setAsyncStorageItem } from "../../common/utils";
import { calculateRouteLength } from "./distance-manager";
import { getAverageSpeed, getCurrentSpeed, getTopSpeed } from "./speed-manager";
import { appConfig } from "../../common/config";
import { startLocationTracking } from "./location-manager";

const REFRESH_TIME_MS = 1000;

export const useActivity = () => {
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef<number>(0);
  const locationsRef = useRef<Location.LocationObject[]>([]);
  const intervalRef = useRef<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activityReport, setActivityReport] = useState<ActivityReport>();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isTracking &&
        !isPaused
      ) {
        getAsyncStorageItem<Location.LocationObject[]>(
          "activityLocation",
          []
        ).then((locations) => {
          locationsRef.current = locations;
        });
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isTracking, isPaused]);

  useEffect(() => {
    const loadPersistedActivity = async () => {
      const savedStartTime = await getAsyncStorageItem<number>(
        "activityStartTime",
        0
      );
      const savedLocations = await getAsyncStorageItem<
        Location.LocationObject[]
      >("activityLocation", []);

      if (savedStartTime > 0 && savedLocations.length > 0) {
        startTimeRef.current = savedStartTime;
        locationsRef.current = savedLocations;
        setIsTracking(true);
        setIsPaused(true);
      }
    };

    loadPersistedActivity();
  }, []);

  useEffect(() => {
    if (!isTracking || isPaused) {
      return;
    }
    const locationSubscription = setInterval(async () => {
      const locations = await getAsyncStorageItem<Location.LocationObject[]>(
        "activityLocation",
        []
      );
      locationsRef.current = locations;
    }, REFRESH_TIME_MS);

    return () => clearInterval(locationSubscription);
  }, [isTracking, isPaused]);

  useEffect(() => {
    if (!isTracking || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    updateMetrics();

    intervalRef.current = setInterval(updateMetrics, REFRESH_TIME_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, isPaused]);

  const updateMetrics = () => {
    const locations = locationsRef.current;

    if (locations.length > 0) {
      const newDistance = Math.round(calculateRouteLength(locations));
      setDistance(newDistance);

      const newSpeed = Math.round(getCurrentSpeed(locations));
      setSpeed(newSpeed);
    }

    if (startTimeRef.current > 0) {
      setDuration(Date.now() - startTimeRef.current);
    }
  };

  const start = async () => {
    if (isTracking) {
      return;
    }

    await startLocationTracking();

    const now = Date.now();
    startTimeRef.current = now;
    locationsRef.current = [];

    await setAsyncStorageItem("activityStartTime", now);
    await setAsyncStorageItem("activityLocation", []);
    await setAsyncStorageItem("activityIsPaused", false);

    setIsTracking(true);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);
  };

  const pause = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation
      );
    }
    await setAsyncStorageItem("activityIsPaused", true);
    setIsPaused(true);
  };

  const resume = async () => {
    await startLocationTracking();
    await setAsyncStorageItem("activityIsPaused", false);
    setIsPaused(false);
  };

  const complete = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation
      );
    }

    const locations = locationsRef.current;

    const newActivityReport: ActivityReport = {
      startTime: startTimeRef.current,
      duration: duration,
      distance: Math.round(calculateRouteLength(locations)),
      averageSpeed: Math.round(getAverageSpeed(locations)),
      topSpeed: Math.round(getTopSpeed(locations)),
      routeLatitudes: locations.map((location) => location.coords.latitude),
      routeLongitudes: locations.map((location) => location.coords.longitude),
    };

    setActivityReport(newActivityReport);
    setIsTracking(false);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);

    startTimeRef.current = 0;
    locationsRef.current = [];
    await setAsyncStorageItem("activityStartTime", 0);
    await setAsyncStorageItem("activityLocation", []);
  };

  const discard = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation
      );
    }

    setIsTracking(false);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);
    setActivityReport(undefined);

    startTimeRef.current = 0;
    locationsRef.current = [];
    await setAsyncStorageItem("activityStartTime", 0);
    await setAsyncStorageItem("activityLocation", []);
  };

  return {
    isTracking,
    isPaused,
    distance,
    speed,
    duration,
    activityReport,
    start,
    pause,
    resume,
    complete,
    discard,
  };
};
