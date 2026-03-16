import { ActivitySegment } from "./activity-definitions";

export const getActivityDuration = (segments: ActivitySegment[]) => {
  let duration = 0;

  for (const segment of segments) {
    if (segment.locations.length > 1) {
      duration +=
        segment.locations[segment.locations.length - 1].timestamp -
        segment.locations[0].timestamp;
    }
  }

  return duration;
};

export const formatActivityDuration = (duration: number) => {
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0) {
    return `${padStart(minutes)}:${padStart(seconds)}`;
  }

  return `${hours}:${padStart(minutes)}:${padStart(seconds)}`;
};

const padStart = (value: number) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const getPausedDuration = (segments: ActivitySegment[]) => {
  if (segments.length < 2) {
    return 0;
  }

  let duration = 0;

  for (let i = 1; i < segments.length; i++) {
    const currSegment = segments[i];
    const prevSegment = segments[i - 1];
    if (!currSegment?.startTime || !prevSegment?.endTime) {
      continue;
    }
    duration += currSegment.startTime - prevSegment.endTime;
  }

  return duration;
};
