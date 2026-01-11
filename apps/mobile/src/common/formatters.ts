import { TFunction } from "./definitions";

export const formatDuration = (duration: number, t: TFunction) => {
  const totalSeconds = Math.floor(duration / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}${t("units.day")} ${hours}${t("units.hour")}`;
  }
  if (hours > 0) {
    return `${hours}${t("units.hour")} ${minutes}${t("units.minute")}`;
  }
  if (minutes > 0) {
    return `${minutes}${t("units.minute")} ${seconds}${t("units.second")}`;
  }
  return `${seconds}${t("units.second")}`;
};

export const formatDistance = (distance: number, t: TFunction) => {
  const totalMeters = Math.floor(distance);
  const kilometers = Math.floor(totalMeters / 1000);
  const meters = totalMeters % 1000;

  if (kilometers > 0) {
    return `${(distance / 1000).toFixed(2)} ${t("units.kilometer")}`;
  }
  return `${totalMeters} ${t("units.meter")}`;
};

export const formatSpeed = (speed: number, t: TFunction) => {
  return `${speed} ${t("units.meterPerMinute")}`;
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = padStart(date.getDate());
  const month = padStart(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const padStart = (value: number) => {
  return value < 10 ? `0${value}` : `${value}`;
};
