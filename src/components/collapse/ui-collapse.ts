import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Collapse.js'
import styles from './internals/Collapse.styles.js'

@customElement('ui-collapse')
export class UiCollapseElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-collapse': Element
  }
}
