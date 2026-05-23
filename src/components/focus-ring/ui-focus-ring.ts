import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/focus-ring.js'
import styles from './internals/focus-ring.styles.js'

/**
 * A focus ring component that provides a visible focus indicator.
 *
 * This component replaces the Material Design `md-focus-ring` component
 * and provides the same functionality with customizable styling.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <ui-focus-ring></ui-focus-ring>
 *
 * <!-- With specific control -->
 * <ui-focus-ring .control="${buttonElement}"></ui-focus-ring>
 *
 * <!-- Using for attribute -->
 * <ui-focus-ring for="my-button"></ui-focus-ring>
 *
 * <!-- Inward focus ring -->
 * <ui-focus-ring inward></ui-focus-ring>
 * ```
 *
 * @cssprop --ui-focus-ring-color - The color of the focus ring border.
 * @cssprop --ui-focus-ring-width - The width of the focus ring border.
 * @cssprop --ui-focus-ring-style - The style of the focus ring border (solid, dashed, etc.).
 * @cssprop --ui-focus-ring-shape-start-start - The start-start corner radius.
 * @cssprop --ui-focus-ring-shape-start-end - The start-end corner radius.
 * @cssprop --ui-focus-ring-shape-end-end - The end-end corner radius.
 * @cssprop --ui-focus-ring-shape-end-start - The end-start corner radius.
 *
 * @csspart focus-ring - The focus ring element.
 */
@customElement('ui-focus-ring')
export class UiFocusRingElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-focus-ring': Element
  }
}
