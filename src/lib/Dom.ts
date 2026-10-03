import { CSSResultOrNative } from 'lit'

/**
 * Searches for an element with the given ID in parent shadow roots and the document.
 *
 * @param id The ID of the element to search for.
 * @param from The element to start the search from.
 *
 * @returns The element with the given ID, or null if not found.
 */
export function findElementInShadowRoots(id: string, from: HTMLElement): HTMLElement | null {
  // First try to find in document
  const rootElm = document.getElementById(id)
  if (rootElm) {
    return rootElm
  }

  // If not found in document, search in parent shadow roots
  let current: HTMLElement | null = from
  const queryId = `#${id}`

  while (current) {
    // Check if current element has a shadow root and search within it
    if (current.shadowRoot) {
      const element = current.shadowRoot.querySelector(queryId)
      if (element) {
        return element as HTMLElement
      }
    }

    // Move up the DOM tree
    if (current.parentNode) {
      if (current.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        // We're inside a shadow root, move to the shadow host
        const shadowRoot = current.parentNode as ShadowRoot
        current = shadowRoot.host as HTMLElement
      } else {
        // Regular DOM traversal
        current = current.parentElement
      }
    } else {
      // No more parents
      current = null
    }
  }

  return null
}

const adoptedStyles = new WeakSet<CSSResultOrNative>()

/**
 * Adopts the provided styles into the document.
 *
 * @param styles - The styles to adopt.
 */
export function adoptStyles(...styles: CSSResultOrNative[]): void {
  if (typeof document === 'undefined' || !('adoptedStyleSheets' in document)) {
    // Constructable stylesheets are not supported in this environment.
    return
  }
  const sheets: CSSStyleSheet[] = []
  for (const style of styles) {
    if (adoptedStyles.has(style)) {
      continue
    }
    if (style instanceof CSSStyleSheet) {
      adoptedStyles.add(style)
      sheets.push(style)
    } else if (style && typeof style === 'object' && 'styleSheet' in style) {
      const styleSheet = (style as { styleSheet?: CSSStyleSheet }).styleSheet
      if (styleSheet instanceof CSSStyleSheet) {
        adoptedStyles.add(style)
        sheets.push(styleSheet)
      }
    }
  }
  if (sheets.length === 0) {
    return
  }
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheets]
}

/**
 * Coordinate bounds representing a rectangular region in viewport pixels.
 */
export interface RectBounds {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Checks whether the given (x, y) coordinates fall within rectangular bounds.
 *
 * @param x The horizontal coordinate (e.g. clientX).
 * @param y The vertical coordinate (e.g. clientY).
 * @param rect The bounding box coordinates.
 * @returns True if the point is within the rectangle, false otherwise.
 */
export function isPointInsideRect(x: number, y: number, rect: RectBounds): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

/**
 * Checks whether the given (x, y) coordinates fall outside rectangular bounds.
 *
 * @param x The horizontal coordinate (e.g. clientX).
 * @param y The vertical coordinate (e.g. clientY).
 * @param rect The bounding box coordinates.
 * @returns True if the point is outside the rectangle, false otherwise.
 */
export function isPointOutsideRect(x: number, y: number, rect: RectBounds): boolean {
  return !isPointInsideRect(x, y, rect)
}

/**
 * Returns the effective visual bounding box of an element, falling back to
 * offsetWidth/offsetHeight if getBoundingClientRect reports 0 dimension.
 *
 * @param el The element to measure.
 * @returns RectBounds covering the element.
 */
export function getElementBounds(el: HTMLElement): RectBounds {
  const rect = el.getBoundingClientRect()
  const left = rect.left
  const top = rect.top
  const right = rect.width > 0 ? rect.right : left + el.offsetWidth
  const bottom = rect.height > 0 ? rect.bottom : top + el.offsetHeight
  return { left, top, right, bottom }
}
