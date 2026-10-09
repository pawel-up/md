import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/ListItem.js'
import styles from './internals/ExpressiveListItem.styles.js'
import common from './internals/ListItemCommon.styles.js'

@customElement('ui-expressive-list-item')
export class UiExpressiveListItemElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-expressive-list-item': UiExpressiveListItemElement
  }
}
