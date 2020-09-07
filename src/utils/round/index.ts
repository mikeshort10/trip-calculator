/**
 * Rounds number to given places to right of the ones places.
 *
 * If a zero or negative number is specified for spaces, will round to left of decimal place
 *
 * Default value for places is 2;
 */
export const round = (num: number, places: number = 2): number => {
  const multiplier = 10 ** places;
  const multiple = Math.round(num * multiplier);
  return +(multiple / multiplier).toFixed(Math.max(0, places));
};

export default round;
