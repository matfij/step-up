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
    avatarMaxSize: 5 * 1024 * 1024,
    avatarExtensions: ["image/jpeg", "image/png"],
    authTokenLength: 6,
    activityNameLengthMin: 1,
    activityNameLengthMax: 100,
    activityDescriptionLengthMax: 800,
  },
} as const;
