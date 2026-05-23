import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/SegmentedButton.js'
import styles from './internals/SegmentedButton.styles.js'

@customElement('ui-segmented-button')
export class UiSegmentedButtonElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-segmented-button': UiSegmentedButtonElement
  }
}
