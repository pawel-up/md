/**
 * Normalizes a color value to a consistent HEX value.
 * @param value The color value
 * @returns Normalized color as hex value
 */
export function normalizeColor(value: string): string {
  const tmp = value.trim().toLowerCase()
  if (!tmp) {
    return ''
  }
  if (tmp[0] === '#') {
    return tmp
  }
  const matches = /(\d+),?\s?(\d+),?\s?(\d+)/.exec(tmp)
  if (matches) {
    const r = Number(matches[1])
    const g = Number(matches[2])
    const b = Number(matches[3])
    return rgbToHex(r, g, b).toLowerCase()
  }
  return tmp
}

/**
 * Converts a hex color string to an RGB object.
 * Supports both shorthand (#rgb) and full (#rrggbb) formats.
 * @param hex The hex color string
 * @returns The RGB object with r, g, b properties
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const normalized = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converts an RGB object to a hex color string.
 * @param r The red component
 * @param g The green component
 * @param b The blue component
 * @returns The hex color string in #rrggbb format
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const rValue = componentToHex(r)
  const gValue = componentToHex(g)
  const bValue = componentToHex(b)
  return `#${rValue}${gValue}${bValue}`
}

function componentToHex(component: number): string {
  return component.toString(16).padStart(2, '0')
}
