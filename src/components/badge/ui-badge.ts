import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Badge.element.js'
import styles from './internals/Badge.styles.js'

/**
 * A Material Design 3 badge custom element.
 *
 * Badges show notifications, counts, or status information on navigation items,
 * tabs, and icons. Supports both small dot badges and large badges with counts or labels.
 *
 * @example
 * ```html
 * <!-- Small dot indicator -->
 * <ui-badge></ui-badge>
 *
 * <!-- Large badge with count -->
 * <ui-badge>4</ui-badge>
 *
 * <!-- Large badge with author-formatted overflow count -->
 * <ui-badge>99+</ui-badge>
 *
 * <!-- Attached to an icon or navigation element -->
 * <div style="position: relative; display: inline-block;">
 *   <ui-icon>mail</ui-icon>
 *   <ui-badge attached>3</ui-badge>
 * </div>
 * ```
 */
@customElement('ui-badge')
export class UiBadgeElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-badge': UiBadgeElement
  }
}
