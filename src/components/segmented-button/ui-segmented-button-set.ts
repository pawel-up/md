import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/SegmentedButtonsSet.js'
import styles from './internals/SegmentedButtonsSet.styles.js'

@customElement('ui-segmented-button-set')
export class UiSegmentedButtonSetElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-segmented-button-set': Element
  }
}
