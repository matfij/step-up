import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { appConfig } from "../../common/config";
import {
  getAsyncStorageItem,
  isNumber,
  setAsyncStorageItem,
} from "../../common/utils";
import { ActivityReport, ActivitySegment } from "./activity-definitions";
import { calculateRouteLength } from "./distance-manager";
import { startLocationTracking } from "./location-manager";
import { getAverageSpeed, getCurrentSpeed, getTopSpeed } from "./speed-manager";
import { rdpCompress } from "./route-compressor";
import { getActivityDuration, getPausedDuration } from "./time-manager";

const REFRESH_TIME_MS = 1000;

export const useActivity = () => {
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef<number>(0);
  const segmentsRef = useRef<ActivitySegment[]>([]);
  const intervalRef = useRef<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activityReport, setActivityReport] = useState<ActivityReport>();
  const [error, setError] = useState("");

  const getAllLocations = () =>
    segmentsRef.current.map((segment) => segment.locations).flat();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isTracking &&
        !isPaused
      ) {
        getAsyncStorageItem<ActivitySegment[]>("activitySegments").then(
          (segments) => {
            if (segments) {
              segmentsRef.current = segments;
            }
          },
        );
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isTracking, isPaused]);

  useEffect(() => {
    const loadPersistedActivity = async () => {
      const savedStartTime =
        await getAsyncStorageItem<number>("activityStartTime");
      const savedSegments =
        await getAsyncStorageItem<ActivitySegment[]>("activitySegments");

      if (
        isNumber(savedStartTime) &&
        savedStartTime > 0 &&
        savedSegments?.[0]
      ) {
        startTimeRef.current = savedStartTime;
        segmentsRef.current = savedSegments;
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
      const segments =
        await getAsyncStorageItem<ActivitySegment[]>("activitySegments");
      if (segments) {
        segmentsRef.current = segments;
      }
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
    const locations = getAllLocations();

    console.log("locations", locations);

    if (locations.length > 0) {
      const newDistance = Math.round(calculateRouteLength(segmentsRef.current));
      setDistance(newDistance);

      const newSpeed = Math.round(getCurrentSpeed(locations));
      setSpeed(newSpeed);
    }

    if (startTimeRef.current > 0) {
      const pausedDuration = getPausedDuration(segmentsRef.current);
      setDuration(Date.now() - startTimeRef.current - pausedDuration);
    }
  };

  const start = async () => {
    if (isTracking) {
      return;
    }

    setError("");

    const started = await startLocationTracking();

    if (!started) {
      setError("activity.missingPermissions");
      return;
    }

    const now = Date.now();
    startTimeRef.current = now;
    segmentsRef.current = [];

    await setAsyncStorageItem("activityStartTime", now);
    await setAsyncStorageItem("activitySegments", [
      { startTime: now, locations: [] },
    ]);
    await setAsyncStorageItem("activityIsPaused", false);

    setIsTracking(true);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);
  };

  const pause = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation,
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation,
      );
    }
    await setAsyncStorageItem("activityIsPaused", true);
    const segments = segmentsRef.current;
    segments[segments.length - 1].endTime = Date.now();
    await setAsyncStorageItem("activitySegments", segments);
    setIsPaused(true);
  };

  const resume = async () => {
    const started = await startLocationTracking();
    if (!started) {
      setError("activity.missingPermissions");
      return;
    }
    const nextSegments = [
      ...segmentsRef.current,
      { startTime: Date.now(), locations: [] },
    ];
    segmentsRef.current = nextSegments;
    await setAsyncStorageItem("activitySegments", nextSegments);
    await setAsyncStorageItem("activityIsPaused", false);
    setIsPaused(false);
  };

  const complete = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation,
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation,
      );
    }

    const segments = segmentsRef.current;
    const locations = getAllLocations();
    const compressedLocations = rdpCompress(locations);

    const newActivityReport: ActivityReport = {
      startTime: startTimeRef.current,
      duration: getActivityDuration(segments),
      distance: Math.round(calculateRouteLength(segments)),
      averageSpeed: Math.round(getAverageSpeed(segments)),
      topSpeed: Math.round(getTopSpeed(segments)),
      routeLatitudes: compressedLocations.map(
        (location) => location.coords.latitude,
      ),
      routeLongitudes: compressedLocations.map(
        (location) => location.coords.longitude,
      ),
    };

    setActivityReport(newActivityReport);
    setIsTracking(false);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);

    startTimeRef.current = 0;
    segmentsRef.current = [];
    await setAsyncStorageItem("activityStartTime", 0);
    await setAsyncStorageItem("activitySegments", []);
  };

  const discard = async () => {
    const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(
      appConfig.taskNames.backgroundLocation,
    );
    if (isLocationTracked) {
      await Location.stopLocationUpdatesAsync(
        appConfig.taskNames.backgroundLocation,
      );
    }

    setIsTracking(false);
    setIsPaused(false);
    setDistance(0);
    setSpeed(0);
    setDuration(0);
    setActivityReport(undefined);

    startTimeRef.current = 0;
    segmentsRef.current = [];
    await setAsyncStorageItem("activityStartTime", 0);
    await setAsyncStorageItem("activitySegments", []);
  };

  return {
    isTracking,
    isPaused,
    distance,
    speed,
    duration,
    activityReport,
    error,
    start,
    pause,
    resume,
    complete,
    discard,
  };
};
