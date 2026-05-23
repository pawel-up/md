import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internal/MenuItem.js'
import styles from './internal/MenuItem.styles.js'
import listStyles from '../list/internals/ListItem.styles.js'

/**
 * Material Design 3 Menu Item component.
 *
 * @element ui-menu-item
 */
@customElement('ui-menu-item')
export class UiMenuItemElement extends Element {
  static override styles: CSSResultOrNative[] = [styles, listStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-menu-item': UiMenuItemElement
  }
}

export { ListItemImage, ListItemLines } from '../list/internals/ListItem.js'
