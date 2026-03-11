import Constants from "expo-constants";

export const appConfig = {
  taskNames: {
    backgroundLocation: "sup-background-location-task",
  },
  activity: {
    minDistanceDiff: 1,
    RDPEpsilon: 5,
  },
  storageKeys: {
    apiToken: "sup-api-key",
    activityStartTime: "sup-activity-start-time",
    activityIsPaused: "sup-activity-is-paused",
    activityLocation: "sup-activity-location",
  },
  validation: {
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameLengthMin: 4,
    usernameLengthMax: 16,
    avatarMaxSize: 5 * 1024 * 1024,
    avatarExtensions: ["image/jpeg", "image/png"],
    authTokenLength: 6,
    activityNameLengthMin: 1,
    activityNameLengthMax: 100,
    activityDescriptionLengthMax: 800,
  },
} as const;

export const getApiUrl = () => {
  if (__DEV__) {
    return Constants.platform?.android
      ? "http://10.0.2.2:8080"
      : "http://127.0.0.1:8080";
  }
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (!apiUrl) {
    throw new Error("Provide apiUrl in app.json extra config.");
  }
  return apiUrl;
};
