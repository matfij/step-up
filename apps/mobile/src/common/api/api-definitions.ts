export enum ApiErrorCode {
  Unknown = -1,
  Fatal = 0,

  // 1xx - Resource errors
  NotFound = 100,
  AlreadyExists = 101,

  // 2xx - Authentication errors
  Unauthorized = 200,
  InvalidAuthToken = 201,
  NotConfirmed = 202,

  // 3xx - Validation errors
  ValidationError = 300,
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public field?: string
  ) {
    super(message);
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: number;
  lastLoginAt?: number;
}
