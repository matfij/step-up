import { LocationObject } from "expo-location";

const METERS_PER_HOUR_TO_METERS_PER_MINUTE = 60;

export const getAverageSpeed = (segments: LocationObject[][]) => {
  let totalSpeed = 0;
  let totalPoints = 0;

  for (const segment of segments) {
    for (let i = 0; i < segment.length; i++) {
      if (segment[i].coords.speed) {
        totalSpeed += segment[i].coords.speed ?? 0;
        totalPoints++;
      }
    }
  }

  if (totalPoints === 0) {
    return 0;
  }

  return (METERS_PER_HOUR_TO_METERS_PER_MINUTE * totalSpeed) / totalPoints;
};

export const getTopSpeed = (segments: LocationObject[][]) => {
  let topSpeed = 0;

  for (const segment of segments) {
    for (let i = 0; i < segment.length; i++) {
      if (segment[i].coords.speed) {
        topSpeed = Math.max(topSpeed, segment[i].coords.speed ?? 0);
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
