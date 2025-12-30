import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Accuracy,
  LocationObject,
  PermissionStatus,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
} from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getAsyncStorageItem, setAsyncStorageItem } from "../../common/utils";
import { appConfig } from "../../common/config";

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
    }
  }
};

TaskManager.defineTask<{ locations: LocationObject[] }>(
  appConfig.taskNames.backgroundLocation,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }
    const isPaused = await getAsyncStorageItem("activityIsPaused", false);
    if (!isPaused) {
      const locations = await getAsyncStorageItem<LocationObject[]>(
        "activityLocation",
        []
      );
      locations.push(...data.locations);
      await setAsyncStorageItem("activityLocation", locations);
    }
  }
);
