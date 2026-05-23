import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/ripple.js'
import styles from './internals/ripple.styles.js'

@customElement('ui-ripple')
export class UiRippleElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-ripple': Element
  }
}
