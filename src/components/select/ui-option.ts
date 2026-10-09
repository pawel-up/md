import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Option.js'
import menuItemCommon from '../menu/internal/MenuItemCommon.styles.js'
import listStyles from '../list/internals/ListItemCommon.styles.js'

@customElement('ui-option')
export class UiOptionElement extends Element {
  static override styles: CSSResultOrNative[] = [listStyles, menuItemCommon]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-option': Element
  }
}

export { ListItemImage, ListItemLines } from '../list/internals/ListItem.js'
