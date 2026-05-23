import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Divider.element.js'
import styles from './internals/Divider.styles.js'

@customElement('ui-divider')
export class UiDividerElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-divider': UiDividerElement
  }
}

export { DividerType } from './internals/Divider.element.js'
