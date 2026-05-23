import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Icon.js'
import styles from './internals/Icon.styles.js'

@customElement('ui-icon')
export class UiIconElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon': Element
  }
}
