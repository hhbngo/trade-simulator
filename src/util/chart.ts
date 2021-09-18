export const parseDataForChart = (data: { [key: string]: number[] }) => {
  const l = data.min.length;
  const interval = l * 0.1;
  const pickedPoints = [];

  for (let i = 0; i < l + interval; i = i + interval) {
    if (data.min[i]) {
      pickedPoints.push({
        name: i + 1,
        min: data.min[i],
        avg: data.avg[i],
        max: data.max[i],
      });
    } else {
      pickedPoints.push({
        name: i,
        min: data.min[i - 1],
        avg: data.avg[i - 1],
        max: data.max[i - 1],
      });
    }
  }

  return pickedPoints;
};
