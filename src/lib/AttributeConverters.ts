/**
 * Converts an attribute value to a floating-point number.
 *
 * This converter is safe to use with Lit's `property` decorator for attributes
 * that represent floating-point numbers. It handles null, undefined, and string
 * inputs gracefully.
 *
 * @param input The input value to convert, typically from an observed attribute.
 * @returns The parsed float value, or undefined if the input is null or undefined.
 */
export function floatConverter(input: unknown): number | undefined {
  if (input === null || input === undefined) {
    return undefined
  }
  return parseFloat(input as string)
}

/**
 * Converts an attribute or property value to a string.
 *
 * This converter is safe to use with Lit's `property` decorator for attributes
 * and properties that represent strings. It handles null, undefined, and number
 * inputs gracefully, always returning a string.
 *
 * @param input The input value to convert, typically from an observed attribute or property.
 * @returns The string representation of the input value, or undefined if the input is null or undefined.
 */
export function stringAndNumberConverter(input: unknown): string | undefined {
  if (input === null || input === undefined) {
    return undefined
  }
  if (typeof input === 'number') {
    return String(input)
  }
  return String(input)
}
