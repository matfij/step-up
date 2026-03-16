import {
  Accuracy,
  LocationObject,
  PermissionStatus,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
} from "expo-location";
import * as TaskManager from "expo-task-manager";
import { appConfig } from "../../common/config";
import { getAsyncStorageItem, setAsyncStorageItem } from "../../common/utils";
import { calculateDistanceBetweenPoints } from "./distance-manager";
import { ActivitySegment } from "./activity-definitions";

export const startLocationTracking = async () => {
  const foregroundPermission = await requestForegroundPermissionsAsync();
  if (foregroundPermission.status === PermissionStatus.GRANTED) {
    const backgroundPermission = await requestBackgroundPermissionsAsync();
    if (backgroundPermission.status === PermissionStatus.GRANTED) {
      await startLocationUpdatesAsync(appConfig.taskNames.backgroundLocation, {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
        foregroundService: {
          notificationTitle: "Activity in progress",
          notificationBody: "Tracking your activity",
        },
      });
      return true;
    }
    return false;
  }
  return false;
};
TaskManager.defineTask<{ locations: LocationObject[] }>(
  appConfig.taskNames.backgroundLocation,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    const isPaused = await getAsyncStorageItem("activityIsPaused", false);
    if (isPaused) {
      return;
    }

    const segments =
      await getAsyncStorageItem<ActivitySegment[]>("activitySegments");

    const currentSegment = segments[segments.length - 1];
    let lastLocation = currentSegment.locations.at(-1);
    const initialLength = currentSegment.locations.length;

    for (const currentLocation of data.locations) {
      if (!lastLocation) {
        currentSegment.locations.push(currentLocation);
        lastLocation = currentLocation;
        continue;
      }

      const distanceDiff = calculateDistanceBetweenPoints(
        lastLocation.coords,
        currentLocation.coords,
      );
      if (distanceDiff > appConfig.activity.minDistanceDiff) {
        currentSegment.locations.push(currentLocation);
      }

      lastLocation = currentLocation;
    }

    if (currentSegment.locations.length > initialLength) {
      segments[segments.length - 1] = currentSegment;
      await setAsyncStorageItem("activitySegments", segments);
    }
  },
);
