import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internal/SubMenu.js'
import menuStyles from './internal/SubMenu.styles.js'
import styles from './internal/Menu.styles.js'

/**
 * Material Design 3 Sub-Menu component.
 *
 * @element ui-sub-menu
 * @attribute {Object} parentItem - The parent menu item element
 * @attribute {Array} menuItems - The sub-menu items data
 * @fires select - Dispatched when a sub-menu item is selected
 * @fires close - Dispatched when the sub-menu is closed
 */
@customElement('ui-sub-menu')
export class UiSubMenuElement extends Element {
  static override styles: CSSResultOrNative[] = [styles, menuStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-sub-menu': UiSubMenuElement
  }
}
