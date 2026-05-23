import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/TextField.js'
import styles from './internals/outlined.styles.js'
import common from './internals/common.styles.js'

@customElement('ui-outlined-text-field')
export class UiOutlinedTextFieldElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-outlined-text-field': UiOutlinedTextFieldElement
  }
}
