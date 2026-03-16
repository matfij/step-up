import { LocationObject } from "expo-location";
import { ActivitySegment, Coordinate } from "./activity-definitions";

export const EARTH_RADIUS_M = 6_371_000;

export const calculateRouteLength = (segments: ActivitySegment[]): number => {
  let total = 0;

  for (const segment of segments) {
    const points = segment.locations.map((location) => location.coords);

    for (let i = 1; i < points.length; i++) {
      total += calculateDistanceBetweenPoints(points[i - 1], points[i]);
    }
  }

  return total;
};

export const calculateDistanceBetweenPoints = (
  a: Coordinate,
  b: Coordinate,
): number => {
  const aLat = degToRad(a.latitude);
  const bLat = degToRad(b.latitude);
  const latDiff = bLat - aLat;
  const lngDiff = degToRad(b.longitude - a.longitude);

  const sinLat = Math.sin(latDiff / 2);
  const sinLng = Math.sin(lngDiff / 2);

  const haversine =
    sinLat * sinLat + Math.cos(aLat) * Math.cos(bLat) * sinLng * sinLng;

  return (
    2 *
    EARTH_RADIUS_M *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
