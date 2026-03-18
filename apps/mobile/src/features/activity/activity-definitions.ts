import { LocationObject } from "expo-location";

export type ActivityReport = {
  startTime: number;
  duration: number;
  distance: number;
  averageSpeed: number;
  topSpeed: number;
  routeLatitudes: number[];
  routeLongitudes: number[];
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type ActivitySegment = {
  startTime: number;
  endTime?: number;
  locations: LocationObject[];
};
