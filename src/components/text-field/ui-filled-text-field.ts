import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/TextField.js'
import styles from './internals/filled.styles.js'
import common from './internals/common.styles.js'

@customElement('ui-filled-text-field')
export class UiFilledTextFieldElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-filled-text-field': UiFilledTextFieldElement
  }
}
