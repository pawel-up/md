import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/TextAreaElement.js'
import styles from '../text-field/internals/filled.styles.js'
import common from '../text-field/internals/common.styles.js'

@customElement('ui-text-area')
export class UiTextAreaElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-text-area': Element
  }
}
