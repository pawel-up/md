import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Chip.js'
import styles from './internals/Chip.styles.js'

@customElement('ui-chip')
export class UiChipElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-chip': UiChipElement
  }
}

export { ChipType } from './internals/Chip.js'
