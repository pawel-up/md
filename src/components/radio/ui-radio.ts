import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/RadioElement.js'
import styles from './internals/Radio.styles.js'

@customElement('ui-radio')
export class UiRadioElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-radio': Element
  }
}
