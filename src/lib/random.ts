/**
 * Generates a random ID for an element.
 * @param prefix The prefix to use for the ID.
 * @returns A random ID.
 */
export function randomId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}
