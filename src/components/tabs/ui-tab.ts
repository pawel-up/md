import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Tab.js'
import styles from './internals/Tab.styles.js'

@customElement('ui-tab')
export class UiTabElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab': Element
  }
}
