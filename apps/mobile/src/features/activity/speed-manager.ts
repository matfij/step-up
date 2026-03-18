import { LocationObject } from "expo-location";
import { ActivitySegment } from "./activity-definitions";

const METERS_PER_HOUR_TO_METERS_PER_MINUTE = 60;

export const getAverageSpeed = (segments: ActivitySegment[]) => {
  let totalSpeed = 0;
  let totalPoints = 0;

  for (const segment of segments) {
    for (let i = 0; i < segment.locations.length; i++) {
      if (segment.locations[i].coords.speed) {
        totalSpeed += segment.locations[i].coords.speed ?? 0;
        totalPoints++;
      }
    }
  }

  if (totalPoints === 0) {
    return 0;
  }

  return (METERS_PER_HOUR_TO_METERS_PER_MINUTE * totalSpeed) / totalPoints;
};

export const getTopSpeed = (segments: ActivitySegment[]) => {
  let topSpeed = 0;

  for (const segment of segments) {
    for (let i = 0; i < segment.locations.length; i++) {
      if (segment.locations[i].coords.speed) {
        topSpeed = Math.max(topSpeed, segment.locations[i].coords.speed ?? 0);
      }
    }
  }

  return METERS_PER_HOUR_TO_METERS_PER_MINUTE * topSpeed;
};

export const getCurrentSpeed = (locations: LocationObject[]) => {
  const latest = locations.at(-1)?.coords;
  if (!latest?.speed) {
    return 0;
  }
  return METERS_PER_HOUR_TO_METERS_PER_MINUTE * latest.speed;
};
