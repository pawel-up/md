import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/List.js'
import styles from './internals/List.styles.js'
import common from './internals/ListCommon.styles.js'

@customElement('ui-list')
export class UiListElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-list': Element
  }
}

export type { UiListItemsChange, UiListSelection } from './internals/List.js'
