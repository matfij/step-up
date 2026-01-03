export class ApiError extends Error {
  constructor(message: string, public key: string, public field?: string) {
    super(message);
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  apiToken: string;
}

export interface Activity {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startTime: number;
  duration: number;
  distance: number;
  averageSpeed: number;
  topSpeed: number;
  routeLatitudes: number[];
  routeLongitudes: number[];
}

export interface Progress {
  id: string;
  userId: string;
  level: number;
  experience: number;
  totalActivities: number;
  totalDuration: number;
  totalDistance: number;
}
