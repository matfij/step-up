export const appConfig = {
  validation: {
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameLengthMin: 4,
    usernameLengthMax: 16,
  },
} as const;
