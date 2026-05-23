import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/ListItem.js'
import styles from './internals/ListItem.styles.js'

@customElement('ui-list-item')
export class UiListItemElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-list-item': UiListItemElement
  }
}

export { ListItemImage, ListItemLines } from './internals/ListItem.js'
