import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/CircularProgress.js'
import styles from './internals/CircularProgress.styles.js'

@customElement('ui-circular-progress')
export class UiCircularProgressElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-circular-progress': UiCircularProgressElement
  }
}
