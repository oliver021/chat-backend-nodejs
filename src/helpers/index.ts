import { sync } from 'glob'
import { union, uniqueId } from 'lodash'

export const globFiles = (location: string): string[] => {
  return union([], sync(location))
}
/**
 * @function uuidGenerator
 * @description generate a unique string to be a unique identifier
 */
export const uuidGenerator = () => uniqueId();
