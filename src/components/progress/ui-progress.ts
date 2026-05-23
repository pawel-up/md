import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/UiProgress.js'
import styles from './internals/UiProgress.styles.js'

@customElement('ui-progress')
export class UiProgressElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-progress': Element
  }
}
