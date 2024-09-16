import { TimeType } from './types';

export function compareTime(time1: TimeType, time2: TimeType): boolean {
  if (time1.day > time2.day) {
    return true;
  }
  if (time1.day < time2.day) {
    return false;
  }
  return time1.subTime > time2.subTime;
}
