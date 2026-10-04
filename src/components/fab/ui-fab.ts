import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Fab.js'
import styles from './internals/Fab.styles.js'

/**
 * Material Design 3 Floating Action Button (FAB) and FAB Menu element.
 *
 * Positions a trigger button (e.g. `<ui-icon-button>` or `<ui-button>`) and optionally
 * coordinates an expandable FAB action speed dial menu.
 *
 * @example
 * ```html
 * <!-- Standalone FAB -->
 * <ui-fab placement="bottom-end">
 *   <ui-icon-button color="filled" aria-label="Add item">
 *     <ui-icon>add</ui-icon>
 *   </ui-icon-button>
 * </ui-fab>
 *
 * <!-- FAB Menu -->
 * <ui-fab placement="bottom-end">
 *   <ui-icon-button color="filled" aria-label="Quick Actions">
 *     <ui-icon>add</ui-icon>
 *   </ui-icon-button>
 *
 *   <ui-button slot="menu" color="tonal">
 *     <ui-icon slot="icon">edit</ui-icon>
 *     Document
 *   </ui-button>
 *   <ui-button slot="menu" color="tonal">
 *     <ui-icon slot="icon">share</ui-icon>
 *     Share
 *   </ui-button>
 * </ui-fab>
 * ```
 */
@customElement('ui-fab')
export class UiFabElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-fab': UiFabElement
  }
}

export type { MdFabPlacement } from './internals/Fab.js'
