import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/CheckboxElement.js'
import styles from './internals/Checkbox.styles.js'

@customElement('ui-checkbox')
export class UiCheckboxElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-checkbox': Element
  }
}
