export const appConfig = {
  taskNames: {
    backgroundLocation: "sup-background-location-task",
  },
  storageKeys: {
    apiToken: "sup-api-key",
    activityLocation: "sup-activity-location",
  },
  validation: {
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameLengthMin: 4,
    usernameLengthMax: 16,
    authTokenLength: 6,
  },
} as const;
