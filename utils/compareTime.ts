import { TimeType } from '../app/upload/run/types';

export function compareTime(time1: TimeType, time2: TimeType): number {
  if (time1.day > time2.day) {
    return 1;
  }
  if (time1.day < time2.day) {
    return -1;
  }
  if (time1.subTime > time2.subTime) {
    return 1;
  }
  if (time1.subTime < time2.subTime) {
    return -1;
  }
  return 0;
}
