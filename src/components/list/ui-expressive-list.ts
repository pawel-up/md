import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/List.js'
import styles from './internals/ExpressiveList.styles.js'

@customElement('ui-expressive-list')
export class UiExpressiveListElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]

  constructor() {
    super()
    this.selector = 'ui-expressive-list-item'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-expressive-list': UiExpressiveListElement
  }
}
