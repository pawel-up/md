import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/button.js'
import styles from './internals/button.styles.js'

/**
 * @attribute {string} form
 */
@customElement('ui-button')
export class UiButtonElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UiButtonElement
  }
}

export type { MdButtonColor } from './internals/button.js'
export type { ButtonType, MdButtonShape, MdButtonSize } from './internals/base.js'
