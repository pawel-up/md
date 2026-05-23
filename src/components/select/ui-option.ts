import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Option.js'
import styles from './internals/Option.styles.js'
import listStyles from '../list/internals/ListItem.styles.js'

@customElement('ui-option')
export class UiOptionElement extends Element {
  static override styles: CSSResultOrNative[] = [styles, listStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-option': Element
  }
}

export { ListItemImage, ListItemLines } from '../list/internals/ListItem.js'
