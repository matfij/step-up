export const appConfig = {
  taskNames: {
    backgroundLocation: "sup-background-location-task",
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
    authTokenLength: 6,
  },
} as const;
