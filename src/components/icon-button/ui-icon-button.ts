import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/IconButton.js'
import styles from './internals/IconButton.styles.js'

@customElement('ui-icon-button')
export class UiIconButtonElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon-button': UiIconButtonElement
  }
}

export type { MdIconButtonColor, MdIconButtonWidth } from './internals/IconButton.js'
export type { ButtonType, MdButtonShape, MdButtonSize } from '../button/internals/base.js'
