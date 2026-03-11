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
  const length = locations.length;
  if (length < 2) {
    return locations;
  }

  const keepMask = new Uint8Array(length);
  keepMask[0] = 1;
  keepMask[length - 1] = 1;

  const stack: [number, number][] = [[0, length - 1]];

  while (stack.length > 0) {
    const [start, end] = stack.pop()!;

    if (end - start < 2) {
      continue;
    }

    let maxDistance = 0;
    let maxIndex = 0;

    for (let i = start + 1; i < end; i++) {
      const distance = getPerpendicularDistance(
        locations[i],
        locations[start],
        locations[end],
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }

    if (maxDistance > epsilon) {
      keepMask[maxIndex] = 1;
      stack.push([start, maxIndex]);
      stack.push([maxIndex, end]);
    }
  }

  return locations.filter((_, i) => keepMask[i]);
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
