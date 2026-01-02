export type ActivityReport = {
  startTime: number;
  duration: number;
  distance: number;
  averageSpeed: number;
  topSpeed: number;
  route: Coordinate[];
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};
