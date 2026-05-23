import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/SwitchElement.js'
import styles from './internals/Switch.styles.js'

@customElement('ui-switch')
export class UiSwitchElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-switch': Element
  }
}
