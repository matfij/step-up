export const appConfig = {
  storageKeys: {
    apiToken: "api-key",
  },
  validation: {
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameLengthMin: 4,
    usernameLengthMax: 16,
    authTokenLength: 6,
  },
} as const;
