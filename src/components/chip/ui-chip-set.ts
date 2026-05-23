import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/ChipSet.js'
import styles from './internals/ChipSet.styles.js'

@customElement('ui-chip-set')
export class UiChipSetElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-chip-set': UiChipSetElement
  }
}
