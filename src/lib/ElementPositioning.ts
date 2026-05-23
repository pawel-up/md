import { StyleInfo } from 'lit/directives/style-map.js'

/**
 * - (none) - the vertical position is the natural box layout position
 * - top - positions the target element so its top box's edge aligns with the top of the anchor element.
 * - bottom - positions the target element so its box's bottom edge aligns with the bottom of the anchor element.
 * - middle - positions the target element so its middle aligns with the middle of the anchor element
 * - auto - positions the element like `top` or `bottom` depending whether the contents can be rendered in the viewport
 */
export type VerticalAlignment = 'top' | 'bottom' | 'middle' | 'auto'
/**
 * - (none) - the horizontal position is the natural box layout position
 * - left - positions the target element so its box's left edge aligns with the left of the anchor element.
 * - right - positions the target element so its box's right edge aligns with the right of the anchor element.
 * - middle - positions the target element so its middle aligns with the middle of the anchor element
 * - auto - positions the element like `left` or `right` depending whether the contents can be rendered in the viewport
 */
export type HorizontalAlignment = 'left' | 'right' | 'middle' | 'auto'

export interface IPositioningOptions {
  /**
   * Vertical positioning of the element.
   * By default it does not compute any styles for vertical positioning.
   */
  vertical?: VerticalAlignment
  /**
   * The offset in px to apply to the computed vertical position
   */
  verticalOffset?: number
  /**
   * Horizontal positioning of the element.
   * By default it does not compute any styles for horizontal positioning.
   */
  horizontal?: HorizontalAlignment
  /**
   * The offset in px to apply to the computed horizontal position
   */
  horizontalOffset?: number
  /**
   * Affects the `horizontal` and `vertical` positioning so that the target element does not overlap with the anchor.
   * For example, when the `vertical` align is `top`, the top edge of the target will be rendered at the bottom
   * of the anchor down to the edge of the viewport.
   *
   * This is ignored when positioning for middle (either vertically or horizontally).
   */
  noOverlap?: boolean

  /**
   * The target into which the target must fit into.
   * By default it is the `window`.
   */
  fitInto?: HTMLElement | Window

  /**
   * When set it also adds `max-width` and `max-height` to the container
   * to match sizing of the fit container.
   */
  constrain?: boolean

  /**
   * A left and right padding to add to the constrained element
   */
  constrainPaddingX?: boolean

  /**
   * A top and bottom padding to add to the constrained element
   */
  constrainPaddingY?: number

  /**
   * When set it adds the `width` set to the anchor's width.
   */
  matchAnchorWidth?: boolean
}

/**
 * @returns The DOMBox for the area where the target element has to fit into.
 */
function fitInfo(option: IPositioningOptions = {}): DOMRect {
  const { fitInto = window } = option
  let result: DOMRect
  if (fitInto === window) {
    result = new DOMRect(0, 0, fitInto.innerWidth, fitInto.innerHeight)
  } else {
    result = (fitInto as HTMLElement).getBoundingClientRect()
  }
  return result
}

/**
 * @param target The target overlay element.
 * @returns true when the target overlay element hast the RTL directive (right-to-left)
 */
function isRTL(target: HTMLElement): boolean {
  // elements inherit this property so no need to check anything else.
  return window.getComputedStyle(target).direction === 'rtl'
}

/**
 * Computes horizontal align for the current locale.
 *
 * @param target The target overlay element
 * @param align The current horizontal align
 * @returns Locale specific horizontal align
 */
function localeHorizontal(target: HTMLElement, align?: HorizontalAlignment): HorizontalAlignment | undefined {
  if (isRTL(target)) {
    if (align === 'right') {
      return 'left'
    }
    if (align === 'left') {
      return 'right'
    }
  }
  return align
}

/**
 * @param anchorRect The anchor element DOMRect object
 * @param options Computation options
 * @returns The vertical position of the target for the top position
 */
function verticalTop(anchorRect: DOMRect, noOverlap?: boolean): number {
  // from the anchor's top line down.
  let { top } = anchorRect
  if (noOverlap) {
    top += anchorRect.height
  }
  return top
}

/**
 * @param anchorRect The anchor element's DOMRect object
 * @param targetHeight The computed height of the target element
 * @param options Computation options
 * @returns The vertical position of the target for the bottom position
 */
function verticalBottom(anchorRect: DOMRect, targetHeight: number, noOverlap?: boolean): number {
  // from the anchor's bottom line up.
  let top = anchorRect.bottom - targetHeight
  if (noOverlap) {
    top -= anchorRect.height
  }
  return top
}

/**
 * @param anchorRect The anchor element's DOMRect object
 * @param targetHeight The computed height of the target element
 * @returns The vertical position of the target for the middle position
 */
function verticalMiddle(anchorRect: DOMRect, targetHeight: number): number {
  return anchorRect.top + anchorRect.height / 2 - targetHeight / 2
}

function verticalAuto(anchorRect: DOMRect, fitRect: DOMRect, targetHeight: number, noOverlap?: boolean): number {
  // we position the element top or bottom depending where we can fit it
  // in the position target.

  // try top position first
  let top = verticalTop(anchorRect, noOverlap)
  if (top + targetHeight > fitRect.bottom) {
    // try bottom
    top = verticalBottom(anchorRect, targetHeight, noOverlap)
    if (top < fitRect.top) {
      // We can't fit the target into either direction so we
      // position it in the middle and constrain the target to the size of the viewport.
      top = verticalMiddle(anchorRect, targetHeight)
    }
  }
  return top
}

function horizontalLeft(anchorRect: DOMRect, noOverlap?: boolean): number {
  let { left } = anchorRect
  if (noOverlap) {
    left += anchorRect.width
  }
  return left
}

function horizontalRight(anchorRect: DOMRect, targetWidth: number, noOverlap?: boolean): number {
  let left = anchorRect.right - targetWidth
  if (noOverlap) {
    left -= anchorRect.width
  }
  return left
}

function horizontalMiddle(anchorRect: DOMRect, targetWidth: number): number {
  return anchorRect.left + anchorRect.width / 2 - targetWidth / 2
}

function horizontalAuto(anchorRect: DOMRect, fitRect: DOMRect, targetWidth: number, noOverlap?: boolean): number {
  // we position the element left or right depending where we can fit it
  // in the position target.

  // try left position first
  let left = horizontalLeft(anchorRect, noOverlap)
  if (left + targetWidth > fitRect.right) {
    // try right position
    left = horizontalRight(anchorRect, targetWidth, noOverlap)
    if (left < fitRect.left) {
      // We can't fit the target into either direction so we
      // position it in the middle and constrain the target to the size of the viewport.
      left = horizontalMiddle(anchorRect, targetWidth)
    }
  }
  return left
}

/**
 * Positions an overlay relative to the anchor element.
 *
 * @param target The target element that has to be positioned relative to the anchor element
 * @param anchor The anchor element. It is used to anchor the position of the overlay.
 * @param options Positioning options.
 * @returns The list of styles to be used to position the target. Can be used with the `styleMap` directive.
 */
export function positionOverlay(
  target: HTMLElement,
  anchor: HTMLElement,
  options: IPositioningOptions = {}
): StyleInfo {
  const result: StyleInfo = {}
  const anchorRect = anchor.getBoundingClientRect()
  const fitRect = fitInfo(options)
  const targetWidth = target.offsetWidth // with margins and everything
  const targetHeight = target.offsetHeight

  let top: number | undefined
  let left: number | undefined

  if (options.vertical === 'top') {
    // from the anchor's top line down.
    top = verticalTop(anchorRect, options.noOverlap)
  } else if (options.vertical === 'bottom') {
    // from the anchor's bottom line up.
    top = verticalBottom(anchorRect, targetHeight, options.noOverlap)
  } else if (options.vertical === 'middle') {
    top = verticalMiddle(anchorRect, targetHeight)
  } else if (options.vertical === 'auto') {
    top = verticalAuto(anchorRect, fitRect, targetHeight, options.noOverlap)
  } else {
    // this mimics the natural box layout.
    top = verticalTop(anchorRect, true)
  }

  const locHorizontal = localeHorizontal(target, options.horizontal)
  if (locHorizontal === 'left') {
    left = horizontalLeft(anchorRect, options.noOverlap)
  } else if (locHorizontal === 'right') {
    left = horizontalRight(anchorRect, targetWidth, options.noOverlap)
  } else if (locHorizontal === 'middle') {
    left = horizontalMiddle(anchorRect, targetWidth)
  } else if (locHorizontal === 'auto') {
    left = horizontalAuto(anchorRect, fitRect, targetWidth, options.noOverlap)
  } else {
    left = horizontalLeft(anchorRect, false)
  }

  if (top !== undefined) {
    if (options.verticalOffset) {
      top += options.verticalOffset
    }
    result.top = `${top}px`
  }
  if (left !== undefined) {
    if (options.horizontalOffset) {
      left += options.horizontalOffset
    }
    result.left = `${left}px`
  }
  if (options.matchAnchorWidth) {
    result.width = `${anchorRect.width}px`
  }
  if (options.constrain) {
    result.overflow = 'auto'
    const { constrainPaddingY = 0 } = options

    const { height } = fitRect
    if (options.vertical === 'top') {
      // from target's `top` to the bottom of `fit`.
      const max = height - top - constrainPaddingY
      if (max > 0) {
        result.maxHeight = `${max}px`
      }
    }
  }
  return result
}
