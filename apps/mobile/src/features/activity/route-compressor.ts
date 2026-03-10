import { LocationObject } from "expo-location";
import { degToRad, EARTH_RADIUS_M } from "./distance-manager";
import { appConfig } from "../../common/config";

/**
 * Ramer-Douglas-Peucker algorithm
 * Recursively simplifies a polyline by removing points within `epsilon` meters
 * of the line between anchors.
 *
 * https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
 */
export const rdpCompress = (
  locations: LocationObject[],
  epsilon = appConfig.activity.RDPEpsilon,
): LocationObject[] => {
  if (locations.length < 2) {
    return locations;
  }

  let maxDistance = 0;
  let maxIndex = 0;

  for (let i = 1; i < locations.length - 1; i++) {
    const distance = getPerpendicularDistance(
      locations[i],
      locations[0],
      locations[locations.length - 1],
    );
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > epsilon) {
    const left = rdpCompress(locations.slice(0, maxIndex + 1), epsilon);
    const right = rdpCompress(locations.slice(maxIndex), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [locations[0], locations[locations.length - 1]];
};

/**
 * Calculates perpendicular distance from a point to a line segment
 * using Haversine-aware approximation (good enough for GPS tracks < 100km)
 *
 * https://en.wikipedia.org/wiki/Haversine_formula
 */
const getPerpendicularDistance = (
  point: LocationObject,
  lineStart: LocationObject,
  lineEnd: LocationObject,
) => {
  const { latitude: lat, longitude: lon } = point.coords;
  const { latitude: latStart, longitude: lonStart } = lineStart.coords;
  const { latitude: latEnd, longitude: lonEnd } = lineEnd.coords;

  const x =
    (lon - lonStart) *
    Math.cos(degToRad((latStart + latEnd) / 2)) *
    EARTH_RADIUS_M *
    degToRad(1);
  const y = (lat - latStart) * EARTH_RADIUS_M * degToRad(1);

  const dx =
    (lonEnd - lonStart) *
    Math.cos(degToRad((latStart + latEnd) / 2)) *
    EARTH_RADIUS_M *
    degToRad(1);
  const dy = (latEnd - latStart) * EARTH_RADIUS_M * degToRad(1);

  const segmentLength = Math.sqrt(dx * dx + dy * dy);
  if (segmentLength === 0) {
    return Math.sqrt(x * x + y * y);
  }

  const t = Math.max(
    0,
    Math.min(1, (x * dx + y * dy) / (segmentLength * segmentLength)),
  );
  const projX = t * dx - x;
  const projY = t * dy - y;

  return Math.sqrt(projX * projX + projY * projY);
};
